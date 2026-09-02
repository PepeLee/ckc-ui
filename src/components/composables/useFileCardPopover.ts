import { createVNode, getCurrentInstance, reactive, render, type AppContext, type VNode } from 'vue';
import FileCardPopover from '../CompForAnswer/FileCardPopover.vue';

export interface FileCardPopoverState {
  visible: boolean;
  top: number;
  left: number;
  showDownload: boolean;
  onDownload: (() => void) | null;
  onSave: (() => void) | null;
}

export interface FileCardPopoverOptions {
  /** 触发按钮的 DOM，popover 相对它定位 */
  anchorEl: HTMLElement;
  /** 是否展示「下载」项（mobile 场景隐藏） */
  showDownload: boolean;
  onDownload: () => void;
  onSave: () => void;
}

const POPOVER_W = 190;
const POPOVER_H = 110;
const GAP = 8;
const EDGE = 8;

// 模块级单例：全局共享一份状态，只挂载一个 popover 实例
const state = reactive<FileCardPopoverState>({
  visible: false,
  top: 0,
  left: 0,
  showDownload: true,
  onDownload: null,
  onSave: null,
});

let container: HTMLElement | null = null;
let vnode: VNode | null = null;
let anchorEl: HTMLElement | null = null;
let listenersBound = false;

const computePosition = () => {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

  // 以下计算在「视口坐标系」内完成（rect 与 innerWidth/innerHeight 均为视口坐标）
  // 水平：默认贴按钮右沿；右侧越界则翻到按钮左下方贴左沿；都不行再夹到视口
  let left = rect.right - POPOVER_W;
  if (left < EDGE) {
    // 右侧放不下，改放到按钮左侧
    left = rect.left;
    if (left + POPOVER_W > window.innerWidth - EDGE) {
      left = window.innerWidth - POPOVER_W - EDGE;
    }
    if (left < EDGE) left = EDGE;
  }

  // 默认向下弹；下方空间不足时尝试向上翻转（视口坐标内判断）
  let top = rect.bottom + GAP;
  const canDown = top + POPOVER_H <= window.innerHeight;
  if (!canDown) {
    // 下方放不下：先按理想位置翻到按钮上方
    const upTop = rect.top - GAP - POPOVER_H;
    if (upTop <= EDGE) {
      // 上方完全放得下：贴按钮顶部
      top = upTop;
    } else {
      // 上方也不足：按"面板中线 ≈ 按钮中线"的对齐方式落点，保留至少一半面板可见且与按钮相连，
      // 避免出现"夹在视口边缘、与按钮完全断开"的不自然空隙
      top = rect.top - GAP - (POPOVER_H / 2);
      // 仍可能为负，夹到视口上沿 EDGE
      if (top < EDGE) top = EDGE;
    }
  }

  // 视口坐标 -> 文档坐标：absolute 相对包含块定位，需补上滚动偏移。
  // 之后面板与锚点同处文档坐标系，随页面滚动一起移动，无需在滚动时重算。
  state.top = top + scrollY;
  state.left = left + scrollX;
};

const ensureMounted = (appContext?: AppContext | null) => {
  if (vnode) return;
  container = document.createElement('div');
  container.className = 'ckc-ui-file-card__popover-root';
  // 锚定到文档原点并成为 popover 的包含块，避免受 body 的 margin / position 影响
  container.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;';
  document.body.appendChild(container);
  vnode = createVNode(FileCardPopover, { state, onClose: closeFileCardPopover });
  // 继承调用方 app 上下文，保证全局组件 / provide 可用
  if (appContext) {
    vnode.appContext = appContext;
  }
  render(vnode, container);
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!state.visible) return;
  const target = event.target as Node | null;
  if (!target) return;
  // popover 自身与锚点内部的点击不在此处理（锚点由调用方自行 toggle）
  if (container?.contains(target)) return;
  if (anchorEl?.contains(target)) return;
  closeFileCardPopover();
};

// 面板与锚点同处文档坐标系，随页面滚动一起移动，无需额外处理。
// 重算结果恒等于打开时的坐标（rect 减小多少、scrollY 就增大多少），此处保留仅为统一入口。
const handleScroll = () => { 
//   if (state.visible) computePosition();
if(state.visible) {
  state.visible = false;
}
};

// 视口尺寸变化（窗口 resize / 移动端地址栏收起等）会改变 innerHeight/innerWidth 与翻转判定，
// 需基于当前锚点位置重新计算并重置定位
const handleResize = () => {
  if (state.visible) computePosition();
};

// 监听只在首次打开时绑定一次，之后所有 FileCard 复用
const bindListeners = () => {
  if (listenersBound) return;
  listenersBound = true;
  document.addEventListener('click', handleDocumentClick);
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleResize);
};

export function openFileCardPopover(options: FileCardPopoverOptions) {
  ensureMounted(getCurrentInstance()?.appContext);
  bindListeners();
  anchorEl = options.anchorEl;
  state.showDownload = options.showDownload;
  state.onDownload = options.onDownload;
  state.onSave = options.onSave;
  computePosition();
  state.visible = true;
}

export function closeFileCardPopover() {
  state.visible = false;
  state.onDownload = null;
  state.onSave = null;
  anchorEl = null;
}

export function toggleFileCardPopover(options: FileCardPopoverOptions) {
  // 再次点击同一个锚点则关闭
  if (state.visible && anchorEl === options.anchorEl) {
    closeFileCardPopover();
    return;
  }
  openFileCardPopover(options);
}

export function useFileCardPopover() {
  return { state, openFileCardPopover, closeFileCardPopover, toggleFileCardPopover };
}
