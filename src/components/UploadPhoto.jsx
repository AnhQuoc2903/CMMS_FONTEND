import React, { useMemo } from "react";
import { Upload, Button, message } from "antd";
import api from "../api/axios";

function UploadPhoto({ workOrderId, photos, onUploaded, disabled }) {
  const fileList = useMemo(
    () =>
      photos.map((p, i) => ({
        uid: p.url || i, // ❗ uid ổn định
        name: "photo",
        status: "done",
        url: p.url,
      })),
    [photos]
  );

  const upload = async ({ file, onSuccess, onError }) => {
    if (disabled) return;

    try {
      const fd = new FormData();
      fd.append("photo", file);

      await api.post(`/work-orders/${workOrderId}/photo`, fd);

      message.success("Photo uploaded");
      onSuccess("ok");
      onUploaded(); // refetch WO
    } catch (e) {
      console.error(e);
      onError(e);
      message.error("Upload failed");
    }
  };

  return (
    <div style={{ minHeight: 170 }}>
      {" "}
      {/* ❗ GIỮ LAYOUT */}
      <Upload
        customRequest={upload}
        listType="picture-card"
        fileList={fileList}
        showUploadList={{ showRemoveIcon: false }}
      >
        <Button disabled={disabled}>Upload Photo</Button>
      </Upload>
    </div>
  );
}

export default React.memo(UploadPhoto);
