import Image from "next/image";
import "./three-ds.css";

/**
 * An open 3DS, drawn in CSS and set in 3D: the bottom half lies back as if
 * resting on a table and the lid stands up behind it, hinged at the back,
 * open toward the viewer but not flat. The top screen shows a photo in an
 * old-school camera app; the bottom screen, another photo in that app's
 * viewer.
 *
 * Everything inside is sized in cqw of the scene, so it scales as one.
 * The transforms are static, so it's drawn once and costs nothing after.
 */
export function ThreeDS({
  photo,
  alt,
  bottomPhoto,
  stamp,
}: {
  photo: string;
  alt: string;
  bottomPhoto: string;
  bottomAlt: string;
  /** The date burned into the corner, old-digital-camera style */
  stamp: string;
}) {
  return (
    <figure className="ds-scene">
      <div className="ds">
        <div className="ds-lid">
          <div className="ds-lid-face">
            <span className="ds-speaker ds-speaker-left" aria-hidden />
            <span className="ds-camera" aria-hidden />

            <div className="ds-top-screen">
              <Image
                src={photo}
                alt={alt}
                fill
                priority
                sizes="(min-width: 64rem) 320px, 60vw"
              />
              <div className="ds-cam-ui" aria-hidden>
                <span className="ds-cam-count">PHOTO 012/100</span>
                <span className="ds-cam-battery">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="ds-cam-frame" />
                <span className="ds-cam-stamp">{stamp}</span>
              </div>
            </div>

            <span className="ds-speaker ds-speaker-right" aria-hidden />
            <span className="ds-slider" aria-hidden>
              <i />
            </span>
            <span className="ds-slider-label" aria-hidden>
              3D
            </span>
          </div>
        </div>

        <div className="ds-hinge" aria-hidden>
          <span className="ds-led ds-led-power" />
          <span className="ds-led ds-led-charge" />
        </div>

        <div className="ds-base" aria-hidden>
          <div className="ds-base-face">
            <span className="ds-circle-pad">
              <i />
            </span>
            <span className="ds-dpad">
              <i />
              <i />
            </span>

            <div className="ds-bottom-screen">
              <span className="ds-app-photo">
                <Image src={bottomPhoto} alt="" fill sizes="160px" />
              </span>
              <span className="ds-app-button ds-app-left">Photos</span>
              <span className="ds-app-button ds-app-right">Effects</span>
            </div>

            <span className="ds-abxy">
              <i>X</i>
              <i>Y</i>
              <i>A</i>
              <i>B</i>
            </span>
            <span className="ds-menu">
              <i />
              <i />
              <i />
            </span>
            <span className="ds-power" />
          </div>
        </div>
      </div>
      <span className="ds-shadow" aria-hidden />
    </figure>
  );
}
