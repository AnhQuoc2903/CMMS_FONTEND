import { Upload, Button, message } from "antd";
import api from "../api/axios";

export default function UploadPhoto({
  workOrderId,
  photos,
  onUploaded,
  disabled,
}) {
  const upload = async ({ file, onSuccess, onError }) => {
    if (disabled) {
      return (
        <p className="text-gray-400">Work order is DONE. Upload disabled.</p>
      );
    }
    try {
      const fd = new FormData();
      fd.append("photo", file);

      await api.post(`/work-orders/${workOrderId}/photo`, fd);

      message.success("Photo uploaded");
      onSuccess("ok");
      onUploaded(); // 🔥 refetch work order
    } catch (e) {
      console.error(e);
      onError(e);
      message.error("Upload failed");
    }
  };

  return (
    <Upload
      customRequest={upload}
      listType="picture-card"
      fileList={photos.map((p, i) => ({
        uid: i,
        name: "photo",
        status: "done",
        url: p.url,
      }))}
    >
      <Button disabled={disabled}>Upload Photo</Button>
    </Upload>
  );
}
