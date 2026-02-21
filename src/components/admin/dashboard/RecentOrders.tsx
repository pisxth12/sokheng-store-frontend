import Link from "next/link";
import { ShoppingCart, ChevronRight, Clock } from "lucide-react";

interface Props {
  orders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

const STATUS_CONFIG = {
  PENDING: { 
    bg: '#fffbeb', 
    border: '#fde68a', 
    text: '#b45309', 
    dot: '#f59e0b',
    lightBg: '#fef3c7',
    label: 'Pending'
  },
  PROCESSING: { 
    bg: '#eff6ff', 
    border: '#bfdbfe', 
    text: '#1d4ed8', 
    dot: '#3b82f6',
    lightBg: '#dbeafe',
    label: 'Processing'
  },
  COMPLETED: { 
    bg: '#f0fdf4', 
    border: '#bbf7d0', 
    text: '#15803d', 
    dot: '#22c55e',
    lightBg: '#dcfce7',
    label: 'Completed'
  },
  CANCELLED: { 
    bg: '#fff1f2', 
    border: '#fecdd3', 
    text: '#be123c', 
    dot: '#ef4444',
    lightBg: '#fee2e2',
    label: 'Cancelled'
  },
};

export const RecentOrders = ({ orders }: Props) => {
  const totalAmount = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
  const pendingCount = orders?.filter(o => o.status === 'PENDING').length || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .ro-card {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 24px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -6px rgba(0,0,0,0.08);
        }

        .ro-card::before {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .ro-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .ro-title-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ro-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .ro-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .ro-view-btn {
          font-size: 12px;
          font-weight: 500;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 6px 14px;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ro-view-btn:hover { background: #dbeafe; border-color: #bfdbfe; }

        /* Stats Cards */
        .ro-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .ro-stat-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 12px;
          border: 1px solid #f3f4f6;
        }

        .ro-stat-label {
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .ro-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .ro-stat-sub {
          font-size: 10px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .ro-divider {
          height: 1px;
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
          margin: 16px 0;
        }

        .ro-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ro-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
          border: 1px solid transparent;
        }
        .ro-row:hover {
          background: #f9fafb;
          border-color: #f3f4f6;
        }

        .ro-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ro-icon {
          width: 36px;
          height: 36px;
          background: #eff6ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .ro-row:hover .ro-icon {
          background: #dbeafe;
        }

        .ro-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ro-order-number {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        .ro-customer {
          font-size: 11px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ro-date {
          font-size: 9px;
          color: #9ca3af;
        }

        .ro-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .ro-amount {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }

        .ro-status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.02em;
          border: 1px solid;
        }

        .ro-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .ro-footer {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ro-legend {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ro-legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: #6b7280;
        }
      `}</style>

      <div className="ro-card">
        {/* Header */}
        <div className="ro-header">
          <div className="ro-title-section">
            <span className="ro-label">Live transactions</span>
            <span className="ro-title">Recent orders</span>
          </div>
          <Link href="/admin/orders" className="ro-view-btn">
            <span>View all</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="ro-stats">
          <div className="ro-stat-card">
            <div className="ro-stat-label">Total volume</div>
            <div className="ro-stat-value">${totalAmount.toLocaleString()}</div>
            <div className="ro-stat-sub">Last 30 days</div>
          </div>
          <div className="ro-stat-card">
            <div className="ro-stat-label">Pending</div>
            <div className="ro-stat-value" style={{ color: '#f59e0b' }}>{pendingCount}</div>
            <div className="ro-stat-sub">Awaiting processing</div>
          </div>
        </div>

        <div className="ro-divider" />

        {/* Orders List */}
        <div className="ro-list">
          {orders?.slice(0, 5).map((order) => {
            const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
            
            return (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="ro-row">
                <div className="ro-left">
                  <div className="ro-icon">
                    <ShoppingCart size={18} color="#2563eb" />
                  </div>
                  <div className="ro-info">
                    <span className="ro-order-number">{order.orderNumber}</span>
                    <span className="ro-customer">
                      {order.customerName}
                      <span className="ro-date">• {order.date}</span>
                    </span>
                  </div>
                </div>

                <div className="ro-right">
                  <span className="ro-amount">${order.amount?.toLocaleString()}</span>
                  <div 
                    className="ro-status-badge"
                    style={{ 
                      background: config.bg, 
                      borderColor: config.border, 
                      color: config.text 
                    }}
                  >
                    <div className="ro-status-dot" style={{ background: config.dot }} />
                    {config.label}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Legend */}
        <div className="ro-footer">
          <div className="ro-legend">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <div key={key} className="ro-legend-item">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: config.dot }} />
                <span>{config.label}</span>
              </div>
            ))}
          </div>
          <Clock size={14} color="#9ca3af" />
        </div>
      </div>
    </>
  );
};