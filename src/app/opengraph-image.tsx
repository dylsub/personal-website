import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// The preview shown when the site is linked in a message or post
export const alt = `${site.name} (${site.handle})`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 96px",
        background: "#1c1c1b",
        color: "#f3efe7",
      }}
    >
      <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1 }}>
        {site.name}
      </div>
      <div style={{ marginTop: 28, fontSize: 40, color: "#f2c94c" }}>
        {`@${site.handle}`}
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 34,
          color: "rgba(243, 239, 231, 0.7)",
        }}
      >
        Dunker with a 43&quot; vertical. Game developer.
      </div>
    </div>,
    size,
  );
}
