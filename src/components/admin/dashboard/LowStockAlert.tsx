import Link from "next/link";
import { AlertCircle, Package } from "lucide-react";

interface Props {
  items: Array<{
    id: number;
    name: string;
    stock: number;
    image: string;
  }>;
}

export const LowStockAlert = ({ items }: Props) => (
  <>
    <style>{`
      .ls-card {
        background: #ffffff;
        border: 1px solid rgba(0,0,0,0.07);
        border-radius: 20px;
        padding: 24px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.06);
      }

      .ls-card::before {
        content: '';
        position: absolute;
        top: -50px; right: -50px;
        width: 160px; height: 160px;
        background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%);
        pointer-events: none;
      }

      .ls-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
      }

      .ls-icon-wrap {
        width: 34px; height: 34px;
        border-radius: 10px;
        background: #fffbeb;
        border: 1px solid #fde68a;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }

      .ls-title {
        font-size: 17px;
        font-weight: 800;
        color: #0a0a0f;
        letter-spacing: -0.02em;
        line-height: 1;
        flex: 1;
      }

      .ls-badge {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #b45309;
        background: #fffbeb;
        border: 1px solid #fde68a;
        padding: 4px 10px;
        border-radius: 100px;
      }

      .ls-divider {
        height: 1px;
        background: linear-gradient(90deg, rgba(0,0,0,0.07) 0%, transparent 100%);
        margin-bottom: 16px;
      }

      .ls-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 10px;
      }
      @media (min-width: 640px)  { .ls-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 768px)  { .ls-grid { grid-template-columns: repeat(3, 1fr); } }
      @media (min-width: 1024px) { .ls-grid { grid-template-columns: repeat(5, 1fr); } }

      .ls-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #ffffff;
        border: 1px solid rgba(0,0,0,0.07);
        border-radius: 12px;
        text-decoration: none;
        position: relative;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s;
      }

      .ls-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.07);
        border-color: #fde68a;
      }

      .ls-item::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, #f59e0b, transparent);
        opacity: 0;
        transition: opacity 0.15s;
      }

      .ls-item:hover::after { opacity: 1; }

      .ls-img {
        width: 36px; height: 36px;
        border-radius: 8px;
        object-fit: cover;
        border: 1px solid rgba(0,0,0,0.06);
        flex-shrink: 0;
      }

      .ls-placeholder {
        width: 36px; height: 36px;
        border-radius: 8px;
        background: #f9fafb;
        border: 1px solid rgba(0,0,0,0.06);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }

      .ls-info { flex: 1; min-width: 0; }

      .ls-name {
        font-size: 12px;
        font-weight: 700;
        color: #0a0a0f;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 3px;
        letter-spacing: -0.01em;
      }

      .ls-stock-row {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .ls-stock-dot {
        width: 5px; height: 5px;
        border-radius: 50%;
        background: #ef4444;
        flex-shrink: 0;
      }

      .ls-stock-text {
        font-size: 10px;
        font-weight: 700;
        color: #be123c;
        letter-spacing: 0.02em;
      }
    `}</style>

    <div className="ls-card">
      <div className="ls-header">
        <div className="ls-icon-wrap">
          {/* UNCHANGED icon */}
          <AlertCircle size={17} style={{ color: '#f59e0b' }} />
        </div>
        <span className="ls-title">Low Stock Alert</span>
        <span className="ls-badge">{items.length} items</span>
      </div>

      <div className="ls-divider" />

      <div className="ls-grid">
        {items.map((item) => (
          <Link key={item.id} href={`/admin/products/${item.id}`} className="ls-item">
            {/* UNCHANGED image logic */}
            {item.image ? (
              <img src={item.image} alt={item.name} className="ls-img" />
            ) : (
              <div className="ls-placeholder">
                <Package size={16} style={{ color: '#9ca3af' }} />
              </div>
            )}

            <div className="ls-info">
              {/* UNCHANGED data */}
              <div className="ls-name">{item.name}</div>
              <div className="ls-stock-row">
                <div className="ls-stock-dot" />
                <span className="ls-stock-text">Stock: {item.stock}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </>
);