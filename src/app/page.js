"use client";

export default function Home() {

  const login = async () => {
    const res = await fetch("/api/puppeteer", {
      method: "POST",
    });
  }

  return (
    <button onClick={()=>{login();}}>Login</button>
  );
}
