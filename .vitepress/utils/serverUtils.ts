import {globby} from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import path from "path";

export async function getPosts({ignore, postPath}) {
    const paths = await getPostMDFilePaths({ignore, postPath});
    let posts = await Promise.all(
        paths.map(async (item) => {
            const filePath = path.join(__dirname, `../..${postPath}/`, item);
            const content = await fs.readFile(filePath, "utf-8");
            const {data} = matter(content);
            if(data.hidden) return null;
            data.date = _convertDate(data.date);
            return {
                frontMatter: data,
                regularPath: `${postPath}/${item.replace(".md", ".html")}`,
            };
        })
    );
    posts = posts.filter(item=>item);
    posts.sort(_compareDate);
    posts.sort(_compareTop);
    return posts;
}

function _convertDate(date = new Date().toString()) {
    const json_date = new Date(date).toJSON();
    return json_date.split("T")[0];
}

function _compareDate(obj1, obj2) {
    return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1;
}

function _compareTop(obj1, obj2) {
    const top1=obj1.frontMatter.top||0;
    const top2=obj2.frontMatter.top||0;
    return top1 < top2 ? 1 : -1;
}

async function getPostMDFilePaths({ignore=[], postPath=''}) {
    return await globby(["**/*.md"], {
        ignore,
        cwd: `.${postPath}/`,
    })
}
