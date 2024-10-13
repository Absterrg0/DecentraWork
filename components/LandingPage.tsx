'use client'
import React from "react";
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
import NavBar from "./Navbar";
export default function LandingPage() {
  return (
    <div className="h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <NavBar></NavBar>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          DecentraWork
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-center text-neutral-200 mt-4">
          The Future of Decentralized Freelancing
        </h2>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Connect, collaborate, and get paid securely using blockchain technology. 
          Join the revolution in freelancing where trust is built into the code.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Button variant="default" size="lg">Find Talent</Button>
          <Button variant="outline" size="lg">Find Work</Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-xl font-semibold text-neutral-200">Secure Payments</h3>
            <p className="text-sm text-neutral-400">Smart contracts ensure fair and timely compensation</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-neutral-200">Global Talent Pool</h3>
            <p className="text-sm text-neutral-400">Access skilled professionals from around the world</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-neutral-200">Low Fees</h3>
            <p className="text-sm text-neutral-400">Decentralized platform means more earnings for you</p>
          </div>
        </div>
      </div>
    </div>
  );
}
