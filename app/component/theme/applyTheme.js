import themes from './index.js';

function getThemeConfig(themeName, themeConfig) {
    let theme = themes[themeName];
    let cfg = {};
    for(let key in theme) {
        let p = theme[key];
        for(let k in p) {
            if(k == 'config') {
                let obj = p[k];
                
                // 替换自定义配置
                if(typeof themeConfig == 'object' && themeConfig.hasOwnProperty(key)) {
                    for(let s in themeConfig[key]) {
                        obj[s] = themeConfig[key][s];
                    }
                }

                cfg[key] = obj;
            }
        }
    }
    return cfg;
}

function applyTheme(themeName) {
    let theme = themes[themeName];
    applyRoot(theme);
    applyTitle(theme);
    applyLayout(theme);
    applyItems(theme);
    applyTable(theme);
}

/**
 * 总体样式应用
 */
function applyRoot(theme) {
    let root = document.getElementById('root');
    let styles = theme.root;

    for(let styleKey in styles) {
        root.style[styleKey] = styles[styleKey];
    }
}

function applyTitle(theme) {
    let title = document.getElementsByClassName('rc-title')[0];
    let styles = theme.title;
    
    if(title && title.offsetHeight > 0) {
        for(let styleKey in styles) {
            if(!title.style[styleKey]) {
                title.style[styleKey] = styles[styleKey];
            }
        }
    }
}

function applyLayout(theme) {
    let layout = document.getElementsByClassName('react-grid-layout')[0];
    let styles = theme.layout;

    if(layout) {
        for(let styleKey in styles) {
            if(!layout.style[styleKey]) {
                layout.style[styleKey] = styles[styleKey];
            }
        }
    }
}

/**
 * 图形基本样式
 */
function applyItems(theme) {
    let items = document.getElementsByClassName('react-grid-item');
    let styles = theme.items;

    if(items.length > 0) {
        for(let i = 0; i < items.length; i++) {
            let item = items[i];
    
            for(let styleKey in styles) {
                if(!item.style[styleKey]) {
                    item.style[styleKey] = styles[styleKey];
                }
            }
        }
    }
}

function applyTable(theme) {
    // table有换屏逻辑，这里不能处理
    return;
}

export { getThemeConfig, applyTheme };