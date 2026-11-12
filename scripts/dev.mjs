import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const args=process.argv.slice(2);const index=args.indexOf('--port');const port=index>=0?Number(args[index+1]):3000;
const root=process.cwd();const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp'};
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+'/'))throw Error();const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(body)}catch{res.writeHead(404);res.end('Not found')}}).listen(port,'0.0.0.0',()=>console.log(`Listening on ${port}`));
