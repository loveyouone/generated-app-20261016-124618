// Liquid Glass Web Preview Interactive Controller (Chinese Localization)

let currentTabIndex = 0;
let isIslandExpanded = false;

function switchTab(index, element) {
  currentTabIndex = index;
  
  // 隐藏所有 Screen 视图
  const screens = ['screenHome', 'screenComponents', 'screenSettings', 'screenAbout'];
  screens.forEach((screenId, i) => {
    const el = document.getElementById(screenId);
    if (el) el.style.display = i === index ? 'block' : 'none';
  });

  // 更新 Tab 高亮
  const tabItems = document.querySelectorAll('.tab-item');
  tabItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // 移动 TabBar 水滴镜片指示器
  const lens = document.getElementById('activeLens');
  if (lens) {
    const positions = ['5px', '25.5%', '50.5%', '75.5%'];
    lens.style.left = positions[index] || '5px';
  }

  // 页面滚动回顶部
  const container = document.getElementById('screenContainer');
  if (container) container.scrollTop = 0;
}

function selectThemeColor(primary, secondary, tileElement) {
  document.documentElement.style.setProperty('--theme-primary', primary);
  document.documentElement.style.setProperty('--theme-secondary', secondary);

  // 更新当前主题名称显示
  const themeNames = {
    '#00E5FF': '极光青 (Aurora Cyan)',
    '#7C4DFF': '幻彩紫 (Electric Purple)',
    '#10B981': '翡翠绿 (Emerald Green)',
    '#F59E0B': '琥珀金 (Amber Gold)',
    '#F43F5E': '玫瑰红 (Rose Red)',
    '#3B82F6': '冰川蓝 (Glacier Blue)',
    '#F1F5F9': '晶冷白 (Crisp White)'
  };
  
  const themeNameEl = document.getElementById('currentThemeName');
  if (themeNameEl) {
    themeNameEl.innerText = themeNames[primary] || '极光青 (Aurora Cyan)';
  }

  // 高亮 Color Tile
  const tiles = document.querySelectorAll('.color-tile');
  tiles.forEach(tile => tile.classList.remove('active'));
  if (tileElement) {
    tileElement.classList.add('active');
  }
}

function updateBlur(value) {
  document.documentElement.style.setProperty('--blur-amount', value + 'px');
  const blurVal = document.getElementById('blurVal');
  if (blurVal) blurVal.innerText = value + 'px';
}

function updateRefraction(value) {
  const opacity = value / 100;
  document.documentElement.style.setProperty('--refraction-opacity', opacity);
  const refractionVal = document.getElementById('refractionVal');
  if (refractionVal) refractionVal.innerText = value + '%';
}

function updateSliderVal(val) {
  const sliderVal = document.getElementById('sliderVal');
  if (sliderVal) sliderVal.innerText = val + '%';
}

function toggleSwitch() {
  const switchEl = document.getElementById('demoSwitch');
  if (switchEl) {
    switchEl.classList.toggle('active');
  }
}

function toggleIsland() {
  const island = document.getElementById('dynamicIsland');
  const islandText = document.getElementById('islandText');
  const islandExpandedContent = document.getElementById('islandExpandedContent');
  
  if (island) {
    isIslandExpanded = !isIslandExpanded;
    if (isIslandExpanded) {
      island.classList.add('expanded');
      islandText.innerText = "Liquid Glass 系统级灵动岛 v2.6";
      if (islandExpandedContent) islandExpandedContent.style.display = "block";
    } else {
      island.classList.remove('expanded');
      islandText.innerText = "Liquid Glass 灵动岛 (系统悬浮窗)";
      if (islandExpandedContent) islandExpandedContent.style.display = "none";
    }
  }
}

function setMode(mode, element) {
  const appContainer = document.getElementById('appContainer');
  const buttons = document.querySelectorAll('.mode-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (element) element.classList.add('active');

  if (appContainer) {
    if (mode === 'light') {
      appContainer.classList.add('light-mode');
      appContainer.classList.remove('dark-mode');
    } else {
      appContainer.classList.add('dark-mode');
      appContainer.classList.remove('light-mode');
    }
  }
}

function filterComponents(query) {
  const items = document.querySelectorAll('.demo-item');
  items.forEach(item => {
    const title = item.getAttribute('data-title') || '';
    if (title.toLowerCase().includes(query.toLowerCase())) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function selectCategory(category, element) {
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => chip.classList.remove('active'));
  if (element) element.classList.add('active');

  const items = document.querySelectorAll('.demo-item');
  items.forEach(item => {
    const itemCat = item.getAttribute('data-cat');
    if (category === '全部组件' || itemCat === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function openDrawer() {
  const drawer = document.getElementById('glassDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('active');
}

function closeDrawer() {
  const drawer = document.getElementById('glassDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

function triggerShimmerFeedback() {
  const btn = document.querySelector('.highlight-btn');
  if (btn) {
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 150);
  }
}

console.log("💧 Liquid Glass v2.6 中文版本初始化成功！");
