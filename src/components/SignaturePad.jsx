import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad({ onSave }) {
  const sigRef = useRef(null);

  const handleSave = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert("Please sign before saving");
      return;
    }

    // ❌ KHÔNG dùng getTrimmedCanvas()
    // const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");

    // ✅ DÙNG CÁI NÀY
    const dataUrl = sigRef.current.getCanvas().toDataURL("image/png");

    console.log("SIGNATURE DATAURL 👉", dataUrl);

    onSave(dataUrl);
  };

  return (
    <>
      <SignatureCanvas
        ref={sigRef}
        canvasProps={{
          width: 400,
          height: 200,
          className: "border",
        }}
      />

      <button
        type="button"
        className="mt-2 bg-blue-500 text-white px-3 py-1"
        onClick={handleSave}
      >
        Save Signature
      </button>
    </>
  );
}
