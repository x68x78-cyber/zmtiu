import Schema from '@deepseek-ai/schemastery'

export const name = 'zimeiti-workbench'
export const inject = ['connection']
export const Config = Schema.object({ root: Schema.string().required() })

export function apply(ctx, config) {
  // 自媒体运营工作台为纯本地整页工具：业务数据由浏览器端 localStorage 持久化，
  // 服务端不保存任何业务数据，无需注册本机接口。
  // config.root 保留供日后需要时放置工作台自己的数据目录。
}