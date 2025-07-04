import {getPosts} from "./utils/serverUtils";
import {buildBlogRSS} from "./utils/rss";
import {transformerTwoslash} from "@shikijs/vitepress-twoslash";
import mathjax3 from "markdown-it-mathjax3";

// https://github.com/mingyuLi97/blog
// https://vitepress.dev/reference/site-config
import type {UserConfig} from 'vitepress'
import {demoblockPlugin, demoblockVitePlugin} from 'vitepress-theme-demoblock'

// https://github.com/mingyuLi97/blog
// https://vitepress.dev/reference/site-config
import {getSidebar} from './utils'
import path from 'node:path'
import {fileURLToPath} from "node:url";
// vite vue插件
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// 其余vite插件
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
async function config(): Promise<Awaited<UserConfig>> {
    const pageSize = 5;
    const postPath = '/note'
    const ignore = [
        "node_modules",
        "README.md",
        "**/*.excalidraw.*",
        "**/.idea/**",
        "**/.obsidian/**",
        "**/.space/**",
        "**/templates/**"
    ]
    const posts = await getPosts({ignore, postPath});
    const postLength = posts.length;

    const excludePaths = [
        "index.md",
        "README.md",
        ".obsidian",
        ".idea",
        ".space",
        ".makemd",
        "node_modules",
        "images",
        "assets",
        ".excalidraw"
    ];
    const note = await getSidebar('note', excludePaths);
    const navs = await getSidebar('navs', excludePaths)
    return {
        //#region build
        // 不因为无效链接导致失败
        // ignoreDeadLinks: true,
        // 不打包的markdown文件路径
        // srcExclude: ["**/旧笔记/*.md"],
        // 将页面元数据提取到单独的 JavaScript 块中，而不是内联在初始 HTML 中。这使每个页面的 HTML 负载更小，并使页面元数据可缓存，从而当站点中有很多页面时可以减少服务器带宽。
        metaChunk: true,
        //#endregion
        title: "moluoxixi Blog",
        description: "",
        base: "/blog/vitepress/",
        lang: "zh-CN",
        outDir: "./docs/vitepress",
        vite: {
            plugins: [
                demoblockVitePlugin() as any,
                vueJsx(),
                // 自动引入
                AutoImport({
                    imports: ['vue'],
                    resolvers: [ElementPlusResolver()],
                    dts: path.resolve(__dirname, '../typings/auto-imports.d.ts'),
                }),
                Components({
                    resolvers: [ElementPlusResolver()],
                    dts: path.resolve(__dirname, '../typings/components.d.ts'),
                }),
            ],
            build: {
                rollupOptions: {},
                // 大资源拆分
                chunkSizeWarningLimit: 1000,
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            },
            resolve: {
                alias: {
                    "@": path.resolve(__dirname, '../../src'),
                },
            },
            css: {
                postcss: {
                    plugins: [
                        tailwindcss(),
                        // 自动添加厂商前缀
                        autoprefixer(),
                    ],
                },
                preprocessorOptions: {
                    scss: {api: 'modern-compiler'},
                },
            },
        },
        head: [
            [
                "link",
                {
                    rel: "icon",
                    type: "image/svg",
                    href: "/blog/vitepress/horse.svg",
                },
            ],
            [
                "meta",
                {
                    name: "author",
                    content: "moluoxixi",
                },
            ],
            [
                "meta",
                {
                    property: "og:title",
                    content: "Home",
                },
            ],
            [
                "meta",
                {
                    property: "og:description",
                    content: "Home of moluoxixi",
                },
            ],
        ],
        lastUpdated: false,
        markdown: {
            theme: {
                light: "vitesse-light",
                dark: "vitesse-dark",
            },
            codeTransformers: [transformerTwoslash()],
            config: (md) => {
                md.use(mathjax3);
                md.use(demoblockPlugin, {
                    customClass: "demoblock-custom",
                });
            },
        },
        themeConfig: {
            // https://vitepress.dev/reference/default-theme-config
            avator: "/blog/vitepress/avator1.png",
            // 标题
            // siteTitle: "reactComponent",
            // logo
            // logo: `https://vuejs.org/images/logo.png`,
            // logoLink: "https://vuejs.org/",
            aside: false,
            // blogs page show firewokrs animation
            showFireworksAnimation: false,

            docsDir: "./",
            posts,
            pageSize,
            postLength,

            buildEnd: buildBlogRSS,

            // 导航栏
            nav: [
                {
                    text: "🏡Blogs",
                    link: "/",
                },
                {
                    text: "vue组件库",
                    collapsible: true,
                    collapsed: true,
                    items: [
                        {
                            text: 'storybook',
                            link: "https://componentproject.github.io/vue-component/storybook/",
                        },
                        {
                            text: 'vitepress',
                            link: "https://componentproject.github.io/vue-component/vitepress/",
                        }
                    ]
                },
                {
                    text: "react组件库",
                    link: "https://componentproject.github.io/react-component/storybook/"
                },
                ...navs,
            ],
            // 侧边栏,配置基本同导航栏
            sidebar: {
                '/note/': note
            },
            socialLinks: [{icon: "github", link: "https://github.com/moluoxixi/blog"}],
            // 搜索配置
            search: {
                // local or algolia
                // provider: 'local'
                //#region algolia
                // algolia有两种方式,使用Crawler爬虫,或者github的DocSearch Scraper Action
                // 参考https://juejin.cn/post/7157340749065895944
                provider: "algolia",
                options: {
                    appId: "DDD3D6CGWQ",
                    apiKey: "3b7df1c9bcf3d1c31fa74e9707936af5",
                    indexName: "blog",
                },
                //#endregion
            },
        },
    };
}

const viteConfig = await config()
export default viteConfig
