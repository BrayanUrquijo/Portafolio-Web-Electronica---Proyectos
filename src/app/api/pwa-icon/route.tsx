import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const size = parseInt(request.nextUrl.searchParams.get("size") || "192");

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #0a0a0f 0%, #1e1e2a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: size * 0.02,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: size * 0.32,
            fontWeight: 900,
            color: "#00f0ff",
            fontFamily: "monospace",
            letterSpacing: "-0.02em",
          }}
        >
          PE
        </div>
        <div
          style={{
            width: size * 0.5,
            height: size * 0.02,
            background: "linear-gradient(90deg, #00f0ff, #8b5cf6)",
            borderRadius: size * 0.01,
          }}
        />
      </div>
    ),
    { width: size, height: size }
  );
}
