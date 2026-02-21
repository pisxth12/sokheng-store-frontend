import Link from "next/link";
import { Users, ChevronRight, UserPlus, Calendar } from "lucide-react";

interface Props {
  users: Array<{
    id: number;
    name: string;
    email: string;
    joinDate: string;
  }>;
}

export const RecentUsers = ({ users }: Props) => {
  const totalNewThisMonth = users?.length || 0;
  const activeToday = users?.filter(u => {
    const today = new Date().toISOString().split('T')[0];
    return u.joinDate === today;
  }).length || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .ru-card {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 24px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -6px rgba(0,0,0,0.08);
        }

        .ru-card::before {
          content: '';
          position: absolute;
          top: -30px;
          right: -30px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .ru-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .ru-title-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ru-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .ru-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .ru-view-btn {
          font-size: 12px;
          font-weight: 500;
          color: #7c3aed;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
          padding: 6px 14px;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ru-view-btn:hover {
          background: #ede9fe;
          border-color: #ddd6fe;
        }

        /* Stats Cards */
        .ru-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .ru-stat-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 12px;
          border: 1px solid #f3f4f6;
        }

        .ru-stat-label {
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .ru-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .ru-stat-sub {
          font-size: 10px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .ru-divider {
          height: 1px;
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
          margin: 16px 0;
        }

        .ru-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ru-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
          border: 1px solid transparent;
        }
        .ru-row:hover {
          background: #f9fafb;
          border-color: #f3f4f6;
        }

        .ru-avatar-wrapper {
          position: relative;
        }

        .ru-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border: 1px solid #ddd6fe;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          position: relative;
          z-index: 1;
        }
        .ru-row:hover .ru-avatar {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border-color: #c4b5fd;
          transform: scale(1.02);
        }

        .ru-avatar-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          background: radial-gradient(circle at 30% 30%, rgba(168,85,247,0.4), transparent 70%);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .ru-row:hover .ru-avatar-glow {
          opacity: 0.5;
        }

        .ru-info {
          flex: 1;
          min-width: 0;
        }

        .ru-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }

        .ru-email {
          font-size: 11px;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ru-date-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f9fafb;
          padding: 6px 10px;
          border-radius: 30px;
          border: 1px solid #f3f4f6;
        }

        .ru-date-icon {
          color: #9ca3af;
          width: 12px;
          height: 12px;
        }

        .ru-date {
          font-size: 10px;
          font-weight: 500;
          color: #6b7280;
          white-space: nowrap;
        }

        .ru-index {
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          border-radius: 3px;
          background: linear-gradient(to bottom, #a855f7, #7c3aed);
          transition: height 0.2s ease;
        }
        .ru-row:hover .ru-index {
          height: 32px;
        }

        .ru-footer {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ru-footer-text {
          font-size: 11px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ru-badge {
          background: #f5f3ff;
          color: #7c3aed;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 500;
        }
      `}</style>

      <div className="ru-card">
        {/* Header */}
        <div className="ru-header">
          <div className="ru-title-section">
            <span className="ru-label">Community</span>
            <span className="ru-title">New Users</span>
          </div>
          <Link href="/admin/users" className="ru-view-btn">
            <span>View all</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="ru-stats">
          <div className="ru-stat-card">
            <div className="ru-stat-label">This month</div>
            <div className="ru-stat-value">{totalNewThisMonth}</div>
            <div className="ru-stat-sub">New registrations</div>
          </div>
          <div className="ru-stat-card">
            <div className="ru-stat-label">Today</div>
            <div className="ru-stat-value" style={{ color: '#7c3aed' }}>{activeToday}</div>
            <div className="ru-stat-sub">Joined today</div>
          </div>
        </div>

        <div className="ru-divider" />

        {/* Users List */}
        <div className="ru-list">
          {users?.slice(0, 5).map((user, index) => (
            <Link key={user.id} href={`/admin/users/${user.id}`} className="ru-row">
              {/* Accent bar */}
              <div className="ru-index" />

              {/* Avatar with glow effect */}
              <div className="ru-avatar-wrapper">
                <div className="ru-avatar">
                  <Users size={18} color="#7c3aed" />
                </div>
                <div className="ru-avatar-glow" />
              </div>

              {/* User info */}
              <div className="ru-info">
                <div className="ru-name">{user.name}</div>
                <div className="ru-email">{user.email}</div>
              </div>

              {/* Date with icon */}
              <div className="ru-date-wrapper">
                <Calendar className="ru-date-icon" />
                <span className="ru-date">{user.joinDate}</span>
              </div>

              {/* Rank indicator for top users */}
              {index === 0 && (
                <div className="ru-badge" style={{ marginLeft: '4px' }}>New</div>
              )}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="ru-footer">
          <div className="ru-footer-text">
            <UserPlus size={14} color="#9ca3af" />
            <span>+{Math.floor(totalNewThisMonth * 0.3)} this week</span>
          </div>
          <div className="ru-footer-text">
            <span>Active rate 98%</span>
          </div>
        </div>
      </div>
    </>
  );
};