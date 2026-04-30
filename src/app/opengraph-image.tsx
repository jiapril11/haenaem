import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "해냄! - 장기 목표 추적 앱";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F8F9",
          gap: 32,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 40,
            backgroundColor: "#6CBFA820",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://haenaem-jet.vercel.app/icon-512.png"
            width={100}
            height={100}
            alt=""
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#2C2C2A",
              letterSpacing: "-2px",
            }}
          >
            해냄!
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#878680",
              fontWeight: 400,
            }}
          >
            목표를 세우고, 매일 기록하고, 결국 해내는
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
