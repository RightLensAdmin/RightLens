import nodemailer from 'nodemailer';
import {randomUUID} from 'node:crypto';

const archive='prayerformvolunteer@gmail.com';
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const trim=s=>typeof s==='string'?s.trim():'';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'})}
  const origin=req.headers.origin||'';
  const host=req.headers.host||'';
  // Only accept requests from the deployed project's own origin.
  if(!origin || !host || (()=>{try{return new URL(origin).host!==host}catch{return true}})())return res.status(403).json({error:'Invalid origin'});
  const {request:rawRequest,response:rawResponse,email:rawEmail,website}=req.body||{};
  if(website)return res.status(400).json({error:'Invalid submission'});
  const request=trim(rawRequest),response=trim(rawResponse),email=rawEmail==null?'':trim(rawEmail);
  if(request.length<10||request.length>10000||response.length<100||response.length>50000||email.length>254||(email&&!emailPattern.test(email)))return res.status(400).json({error:'Invalid submission'});
  const user=process.env.GMAIL_USER,pass=process.env.GMAIL_APP_PASSWORD;
  if(!user||!pass)return res.status(503).json({error:'Email service not configured'});
  const id=randomUUID(),time=new Date().toISOString();
  const transport=nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,auth:{user,pass},connectionTimeout:12000,greetingTimeout:12000,socketTimeout:20000});
  const full=`Submission ID: ${id}\nTimestamp (UTC): ${time}\n\nORIGINAL PRAYER REQUEST\n${request}\n\nCOMPLETE DISPLAYED RIGHT-PRAYER WORD\n${response}\n`;
  try{
    // Gmail will retain a copy in Sent; sending to the archive inbox allows a Gmail filter/label.
    await transport.sendMail({from:user,to:archive,subject:`RightLens Prayer Archive | ${id}`,text:full,disableFileAccess:true,disableUrlAccess:true});
  }catch(e){return res.status(502).json({archived:false,error:'Archive email was not accepted'})}
  let copySent=false;
  if(email){try{await transport.sendMail({from:user,to:email,subject:'Your RightLens Prayer Word',text:`YOUR PRAYER REQUEST\n${request}\n\nYOUR COMPLETE RIGHT-PRAYER WORD\n${response}\n`,disableFileAccess:true,disableUrlAccess:true});copySent=true}catch(e){/* Archive already accepted; report copy separately. */}}
  return res.status(200).json({archived:true,copySent,id});
}
