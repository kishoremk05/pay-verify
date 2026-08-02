import React from "react";

export default function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-white">
      {/* Enhanced Grid Background Pattern matching NorthGrid screenshot */}
      <div 
        className="absolute inset-0 opacity-[0.75]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.075) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.075) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
          backgroundPosition: "center top",
        }}
      />
    </div>
  );
}

