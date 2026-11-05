import { ImageResponse } from "next/og";

// The tab and search-result icon: a "D" on the site's dark ground
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        background: "#1c1c1b",
        color: "#f2c94c",
        fontSize: 46,
        fontWeight: 800,
      }}
    >
      D
    </div>,
    size,
  );
}
