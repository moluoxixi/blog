import {globby} from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import path from "path";

const includePaths = ["posts/", "note/"];

export async function getPosts() {
    const paths = await getPostMDFilePaths();
    let posts = await Promise.all(
        paths.map(async (item) => {
            const filePath = path.join(__dirname, "../..", item);
            const content = await fs.readFile(filePath, "utf-8");
            const {data} = matter(content);
            if(data.hidden) return null;
            data.date = _convertDate(data.date);
            return {
                frontMatter: data,
                regularPath: `/${item.replace(".md", ".html")}`,
            };
        })
    );
    posts = posts.filter(item=>item);
    posts.sort(_compareDate);
    return posts;
}

function _convertDate(date = new Date().toString()) {
    const json_date = new Date(date).toJSON();
    return json_date.split("T")[0];
}

function _compareDate(obj1, obj2) {
    return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1;
}

async function getPostMDFilePaths() {
    const paths = await globby(["**/*.md"], {
        ignore: [
            "node_modules",
            "README.md",
            "**/*.excalidraw.*",
            "**/.idea/**",
            "**/.obsidian/**",
            "**/.space/**"
        ],
        cwd: "./",
    });
    return paths.filter((item) => includePaths.some((path) => item.includes(path)));
}

export async function getPostLength() {
    // getPostMDFilePath return type is object not array
    return [...(await getPostMDFilePaths())].length;
}
