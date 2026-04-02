import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, Database, Trophy, Play, Settings, 
  RotateCcw, Trash2, Download, Image, Music, 
  X, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';

interface UserGuideProps {
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();

  const sections = {
    zh: [
      {
        title: "1. 准备工作 (数据导入)",
        icon: <Database className="text-blue-500" />,
        content: [
          "点击右上角 [设置] 图标进入控制台。",
          "在 [数据管理] 模块，分别导入 [员工名单] 和 [奖项名单]。",
          "支持 Excel (.xlsx, .xls) 和 CSV 格式。",
          "员工名单需包含：工号、姓名、部门、...。",
          "奖项名单需包含：等级、品名、数量、...。"
        ]
      },
      {
        title: "2. 奖池隔离机制",
        icon: <ShieldCheck className="text-emerald-500" />,
        content: [
          "系统支持 [精英] 和 [全员] 两个独立奖池。",
          "精英奖项仅限精英奖池的员工抽取。",
          "全员奖项面向全员奖池的员工抽取。",
          "导入时系统会自动识别关键词（如：[精英] 和 [全员] 等）。"
        ]
      },
      {
        title: "3. 开始抽奖",
        icon: <Play className="text-orange-500" />,
        content: [
          "在主界面下方选择一个 [待选奖项]。",
          "选择抽奖模式：[自动] (点击开始后自动停止) 或 [手动] (需手动点击停止)。",
          "点击 [开始抽奖] 按钮，系统将进入滚动状态。",
          "中奖后，获奖者将自动展示在 [荣耀墙] 中。"
        ]
      },
      {
        title: "4. 结果管理与导出",
        icon: <Download className="text-purple-500" />,
        content: [
          "点击 [导出中奖名单] 可下载 Excel 格式的完整获奖记录。",
          "点击 [截图整个界面] 可生成包含所有获奖记录的高清长图。",
          "如需移除某条中奖记录，点击荣耀墙卡片右上角的 [垃圾桶] 图标（库存会自动恢复）。"
        ]
      },
      {
        title: "5. 系统重置",
        icon: <RotateCcw className="text-red-500" />,
        content: [
          "软重置：仅清除中奖记录，保留人员和奖项。",
          "硬重置：清除记录和人员，保留奖项设置。",
          "恢复出厂：清除所有数据，回归初始状态。"
        ]
      }
    ],
    en: [
      {
        title: "1. Preparation (Data Import)",
        icon: <Database className="text-blue-500" />,
        content: [
          "Click the [Settings] icon in the top right to enter the console.",
          "In [Data Management], import [Staff List] and [Awards List].",
          "Supports Excel (.xlsx, .xls) and CSV formats.",
          "Staff list should include: Staff ID, Name, Department, ...",
          "Awards list should include: Tier, Name, Quantity, ..."
        ]
      },
      {
        title: "2. Pool Isolation Mechanism",
        icon: <ShieldCheck className="text-emerald-500" />,
        content: [
          "The system supports two independent pools: [Elite] and [General].",
          "Elite prizes are only for employees in the Elite pool.",
          "General prizes are for employees in the General pool.",
          "The system automatically identifies keywords (e.g., General, Elite, etc.)."
        ]
      },
      {
        title: "3. Start Drawing",
        icon: <Play className="text-orange-500" />,
        content: [
          "Select a [Prize] from the list at the bottom of the main interface.",
          "Choose draw mode: [Auto] (stops automatically) or [Manual] (requires manual stop).",
          "Click [Start Draw] to begin the rolling animation.",
          "Winners will be automatically displayed on the [Wall of Honor]."
        ]
      },
      {
        title: "4. Results Management & Export",
        icon: <Download className="text-purple-500" />,
        content: [
          "Click [Export Winners] to download the full record in Excel format.",
          "Click [Capture Full Screen] to generate a high-res image of all results.",
          "To remove a record, click the [Trash] icon on the winner card (stock will be restored)."
        ]
      },
      {
        title: "5. System Reset",
        icon: <RotateCcw className="text-red-500" />,
        content: [
          "Soft Reset: Clears winning records only, keeps staff and prizes.",
          "Hard Reset: Clears records and staff, keeps prize settings.",
          "Factory Reset: Erases all data and returns to initial state."
        ]
      }
    ],
    vi: [
      {
        title: "1. Chuẩn bị (Nhập dữ liệu)",
        icon: <Database className="text-blue-500" />,
        content: [
          "Nhấp vào biểu tượng [Cài đặt] ở góc trên bên phải để vào bảng điều khiển.",
          "Trong [Quản lý dữ liệu], nhập [Danh sách nhân viên] và [Danh sách giải thưởng].",
          "Hỗ trợ định dạng Excel (.xlsx, .xls) và CSV.",
          "Danh sách nhân viên: Mã NV, Tên, Bộ phận, ...",
          "Danh sách giải thưởng: Hạng, Tên giải, Số lượng, ..."
        ]
      },
      {
        title: "2. Cơ chế cách ly nhóm giải",
        icon: <ShieldCheck className="text-emerald-500" />,
        content: [
          "Hệ thống hỗ trợ hai nhóm độc lập: [Elite] và [General].",
          "Giải thưởng Elite chỉ dành cho nhân viên trong nhóm Elite.",
          "Giải thưởng General dành cho nhân viên trong nhóm General.",
          "Hệ thống tự động nhận diện từ khóa (ví dụ: Elite, General, v.v.)."
        ]
      },
      {
        title: "3. Bắt đầu bốc thăm",
        icon: <Play className="text-orange-500" />,
        content: [
          "Chọn một [Giải thưởng] từ danh sách ở dưới cùng của giao diện chính.",
          "Chọn chế độ: [Tự động] (tự dừng) hoặc [Thủ công] (cần dừng bằng tay).",
          "Nhấp vào [Bắt đầu bốc thăm] để bắt đầu hiệu ứng quay số.",
          "Người trúng thưởng sẽ tự động hiển thị trên [Bảng Vinh Danh]."
        ]
      },
      {
        title: "4. Quản lý kết quả & Xuất dữ liệu",
        icon: <Download className="text-purple-500" />,
        content: [
          "Nhấp [Xuất danh sách] để tải xuống bản ghi đầy đủ ở định dạng Excel.",
          "Nhấp [Chụp toàn bộ giao diện] để tạo ảnh chất lượng cao của tất cả kết quả.",
          "Để xóa một bản ghi, nhấp vào biểu tượng [Thùng rác] trên thẻ người thắng."
        ]
      },
      {
        title: "5. Đặt lại hệ thống",
        icon: <RotateCcw className="text-red-500" />,
        content: [
          "Đặt lại nhẹ: Chỉ xóa kết quả trúng thưởng, giữ lại nhân viên và giải thưởng.",
          "Đặt lại cứng: Xóa kết quả và nhân viên, giữ lại cài đặt giải thưởng.",
          "Xóa tất cả: Xóa toàn bộ dữ liệu và quay lại trạng thái ban đầu."
        ]
      }
    ]
  };

  const currentLang = i18n.language.startsWith('zh') ? 'zh' : i18n.language.startsWith('vi') ? 'vi' : 'en';
  const currentSections = sections[currentLang];

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-4 border-yellow-400">
        <header className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 p-3 rounded-2xl shadow-lg">
              <BookOpen className="text-red-700" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase">
                {currentLang === 'zh' ? '操作指引' : currentLang === 'vi' ? 'Hướng dẫn sử dụng' : 'User Guide'}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                Lottery System Documentation
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-4 hover:bg-slate-200 rounded-2xl transition-colors text-slate-400 hover:text-slate-900"
          >
            <X size={28} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
          {currentSections.map((section, idx) => (
            <section key={idx} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-xl">
                  {section.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 italic">
                  {section.title}
                </h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                    <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-yellow-400 hover:text-black transition-all shadow-xl active:scale-95"
          >
            {currentLang === 'zh' ? '我知道了' : currentLang === 'vi' ? 'Tôi đã hiểu' : 'Got it'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserGuide;
