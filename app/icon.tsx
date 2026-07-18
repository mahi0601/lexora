import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Same mark as components/branding/logo.tsx, re-drawn for the favicon/app
// icon: teal badge, white "L", coral terminal.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4F918D",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", position: "relative", width: 17, height: 22 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 5,
              height: 22,
              background: "#FFFFFF",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: 12,
              height: 5,
              background: "#FFFFFF",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 5,
              height: 5,
              background: "#E8836F",
              borderRadius: 1,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
