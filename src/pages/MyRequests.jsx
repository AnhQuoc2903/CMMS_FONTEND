/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { getMyRequests } from "../api/tenant.api";
import {
  Table,
  Image,
  Tag,
  Empty,
  Button,
  Card,
  Space,
  Typography,
  theme,
  Flex,
  Tooltip,
  Segmented,
} from "antd";
import {
  PlusOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { useToken } = theme;

export default function MyRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const nav = useNavigate();
  const { token } = useToken();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyRequests();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      SUBMITTED: {
        color: "processing",
        icon: <ClockCircleOutlined />,
        text: "Submitted",
      },
      BUILDING_APPROVED: {
        color: "warning",
        icon: <SyncOutlined spin />,
        text: "Building Approved",
      },
      MSP_REVIEWED: {
        color: "purple",
        icon: <FileTextOutlined />,
        text: "MSP Reviewed",
      },
      FINAL_APPROVED: {
        color: "success",
        icon: <CheckCircleOutlined />,
        text: "Final Approved",
      },
      REJECTED: {
        color: "error",
        icon: <CloseCircleOutlined />,
        text: "Rejected",
      },
    };
    return config[status] || { color: "default", icon: null, text: status };
  };

  const columns = [
    {
      title: "Request Info",
      dataIndex: "title",
      width: "30%",
      render: (title, record) => (
        <div>
          <Text strong style={{ fontSize: 15 }}>
            {title}
          </Text>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(record.createdAt).toLocaleString("vi-VN")}
            </Text>
          </div>
        </div>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 180,
      align: "center",
      render: (status) => {
        const { color, icon, text } = getStatusConfig(status);

        return (
          <Tag
            icon={icon}
            color={color}
            style={{
              margin: 0,
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
            }}
          >
            {text}
          </Tag>
        );
      },
    },

    {
      title: "Images",
      dataIndex: "imageUrl",
      width: 220,
      align: "center",
      render: (images) =>
        images?.length ? (
          <Image.PreviewGroup>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
              }}
            >
              {images.slice(0, 3).map((img, i) => (
                <Image
                  key={i}
                  src={img.url}
                  width={48}
                  height={48}
                  style={{
                    objectFit: "cover",
                    borderRadius: 12,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                />
              ))}
            </div>
          </Image.PreviewGroup>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            No images
          </Text>
        ),
    },
  ];

  const filteredData =
    filterStatus === "all"
      ? data
      : data.filter((item) => item.status === filterStatus);

  const statusCounts = {
    all: data.length,
    SUBMITTED: data.filter((item) => item.status === "SUBMITTED").length,
    BUILDING_APPROVED: data.filter(
      (item) => item.status === "BUILDING_APPROVED",
    ).length,
    MSP_REVIEWED: data.filter((item) => item.status === "MSP_REVIEWED").length,
    FINAL_APPROVED: data.filter((item) => item.status === "FINAL_APPROVED")
      .length,
    REJECTED: data.filter((item) => item.status === "REJECTED").length,
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        background: token.colorBgLayout,
      }}
    >
      <Card
        style={{
          borderRadius: 24,
          boxShadow: token.boxShadowTertiary,
          border: `1px solid ${token.colorBorderSecondary}`,
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 24 }}
      >
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 24, flexWrap: "wrap", gap: 16 }}
        >
          <div>
            <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
              My Requests
            </Title>
            <Text type="secondary">Track and manage your service requests</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => nav("/request")}
            style={{
              borderRadius: 40,
              height: 44,
              paddingLeft: 20,
              paddingRight: 24,
              boxShadow: token.boxShadowSecondary,
            }}
          >
            Create Request
          </Button>
        </Flex>

        {/* Status Filter */}
        <div style={{ marginBottom: 24, overflowX: "auto" }}>
          <Segmented
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: `All (${statusCounts.all})`, value: "all" },
              {
                label: `Submitted (${statusCounts.SUBMITTED})`,
                value: "SUBMITTED",
              },
              {
                label: `Building (${statusCounts.BUILDING_APPROVED})`,
                value: "BUILDING_APPROVED",
              },
              {
                label: `MSP (${statusCounts.MSP_REVIEWED})`,
                value: "MSP_REVIEWED",
              },
              {
                label: `Approved (${statusCounts.FINAL_APPROVED})`,
                value: "FINAL_APPROVED",
              },
              {
                label: `Rejected (${statusCounts.REJECTED})`,
                value: "REJECTED",
              },
            ]}
            style={{
              background: token.colorBgContainerDisabled,
              padding: 4,
              borderRadius: 40,
            }}
          />
        </div>

        {/* Table */}
        <Table
          rowKey="_id"
          dataSource={filteredData}
          columns={columns}
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Text type="secondary">No requests found</Text>
                    <br />
                  </div>
                }
              />
            ),
          }}
          pagination={{
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} requests`,

            pageSizeOptions: ["6", "12", "24"],
            style: { marginTop: 16 },
          }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    ...props.style,
                    background: token.colorBgContainer,
                    fontWeight: 600,
                  }}
                />
              ),
            },
          }}
          rowClassName={() => "request-table-row"}
          style={{
            borderRadius: 16,
            overflow: "hidden",
          }}
        />
      </Card>

      <style jsx>{`
        .request-table-row:hover {
          cursor: pointer;
          background: ${token.colorBgTextHover} !important;
        }
      `}</style>
    </div>
  );
}
