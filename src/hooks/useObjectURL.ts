// Hook này được lấy về để tránh việc rò rỉ bộ nhớ.
// Nguồn: https://www.jacobparis.com/content/file-image-thumbnails
// 
import { useEffect, useRef } from "react";

export function useObjectUrls() {

  const mapRef = useRef<Map<File, string> | null>(null)
  // remove after render rounter
  useEffect(() => {
    const map = new Map();
    mapRef.current = map;
    return () => {
      for (const [, url] of map) {
        URL.revokeObjectURL(url);
      }
      mapRef.current = null
    }
  }, [])
  
  return function getObjectUrl(file: File) {
    const map = mapRef.current;
    if (!map) {
      throw Error("Cannot getObjectUrl while unmounted");
    }
    if (!map.has(file)) {
      const url = URL.createObjectURL(file);
      map.set(file, url);
    }
    const url = map.get(file);
    if (!url) {
      throw Error("Object url not found");
    }
    return url;
  }

}