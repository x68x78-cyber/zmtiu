#!/usr/bin/env node
// Build script: embeds the reference 自媒体运营工作台.html into a DSH workbench client.
// Reads the HTML source, JSON-escapes it, and writes lib/client.js that mounts it
// as a self-contained iframe (srcDoc) inside a customFrame workbench panel.
//
// 公开仓库：https://github.com/x68x78-cyber/zmtiu。package.json 的 repository 指回它，
// 工作台市场以 owner/repo = x68x78-cyber/zmtiu 作为唯一身份。

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = process.env.SRC_HTML || join(ROOT, 'docs', 'src', 'index.html')
const OUT = join(ROOT, 'lib', 'client.js')

const html = readFileSync(SRC, 'utf8')
// JSON.stringify produces a safe double-quoted JS string literal (no backticks, no ${}).
const embedded = JSON.stringify(html)

const client = `/**
 * 自媒体运营工作台（zimeiti-workbench）—— DSH Desktop 工作台浏览器端。
 *
 * 整页业务工作台（customFrame: true）：把参考 HTML 自媒体运营工作台作为自包含 iframe
 * （srcDoc）挂载，保留其全部功能（今日/选题/脚本/发布/复盘 五个板块，珊瑚粉少女风，
 * 原生 SVG 图表，localStorage 持久化，JSON 备份导入导出、CSV 导出）。
 *
 * 数据只存在本机浏览器 localStorage（键 wb_media_studio_v），不联网、不上传。
 * 纯本地工作台：省略 repository，由宿主从真实客户端 npm 包名生成 local:zimeiti-workbench。
 */
window.__ModuleLoader__.load({
  id: 'zimeiti-workbench',
  factory: (require) => {
    const React = require('react')
    const h = React.createElement

    // 参考 HTML 原文（自包含单文件应用）。
    const APP_HTML = ${embedded}

    // 工作台根容器：填满 customFrame 宿主主内容区。
    const frameStyle = {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      border: 'none',
      background: '#F7F5F1',
      display: 'block'
    }

    function ZimeitiPanel() {
      // 每次挂载时若引用 HTML 内部抛错，不阻断宿主；错误留在 iframe 内自包含环境。
      return h('iframe', {
        srcDoc: APP_HTML,
        style: frameStyle,
        title: '自媒体运营工作台',
        sandbox: 'allow-scripts allow-same-origin allow-forms allow-modals allow-downloads'
      })
    }

    function apply(ctx) {
      ctx.effect(() => ctx.desktopWorkbenches.register({
        title: '自媒体运营工作台',
        description: '泛自媒体博主运营工作台：今日灵感、选题会、脚本、发布排期与复盘四率看板，五个板块一站式跑通「选题→脚本→发布→复盘」主循环。',
        category: '内容运营',
        panelTitle: '自媒体运营工作台',
        icon: '🌸',
        audience: '个人 / 小团队',
        customFrame: true
      }, ZimeitiPanel))
    }

    return { apply, inject: ['desktopWorkbenches'] }
  }
})
`

writeFileSync(OUT, client, 'utf8')
console.log('Wrote', OUT, client.length, 'bytes, html', html.length, 'chars')