// import fs from 'fs';
// import path from 'path';

// const filePath = path.join(process.cwd(),"src", 'data', "content", 'aboutus.json');
import contentApiRequest from "@/src/apiRequests/content";

export default async function AboutUs() {
    const data = await contentApiRequest.getAboutUs();
    // const fileContent = fs.readFileSync(filePath, 'utf8');
    return (
        <>
            {JSON.stringify(data)}
        </>
    );
}