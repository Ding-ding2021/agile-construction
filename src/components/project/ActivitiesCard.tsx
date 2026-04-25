const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

const activities = [
  { id: 1, user: '赵敏', action: '任务已完成', detail: '消防喷淋系统调试验收', time: '2小时前', icon: '38.svg' },
  { id: 2, user: '李采购', action: '新增风险', detail: '石材供应商交货延迟', time: '5小时前', icon: '39.svg' },
  { id: 3, user: '张伟', action: '进度更新', detail: '隔墙与吊顶施工进度 72%', time: '1天前', icon: '40.svg' },
  { id: 4, user: '张伟', action: '资料上传', detail: '第三次进度汇报.pptx', time: '3天前', icon: '41.svg' },
];

const ActivitiesCard = () => {
  return (
    <div className="card activities-card">
      <div className="card-header">
        <h2>最近动态</h2>
      </div>
      <div className="activities-list">
        {activities.map((activity) => (
          <div className="activity-item" key={activity.id}>
            <img src={`${ASSET_BASE}/${activity.icon}`} alt="" className="activity-icon" />
            <div className="activity-content">
              <div className="activity-title">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-action"> {activity.action}</span>
              </div>
              <div className="activity-detail">{activity.detail}</div>
            </div>
            <div className="activity-time">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesCard;
