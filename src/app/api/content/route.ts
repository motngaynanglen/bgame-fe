import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(),"src", 'data', "content", 'aboutus.json');
console.log(filePath)
export async function POST(request: Request) {
    const res = await request.json();
    const { title, content } = res.body;
    const newData = { title, content };
    
    try {
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
        return new Response(
            JSON.stringify({ message: 'Content updated successfully' }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
    } catch (error) {
        res.status(500).json({ error: 'Failed to write to the file.' });
    }
}
export async function GET(request: Request) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        return new Response(
            JSON.stringify(data),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Lỗi AboutUs GET cmnr' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
}