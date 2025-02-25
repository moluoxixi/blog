type Post = {
    frontMatter: {
        date?: string;
        title?: string;
        tags?: string[];
        description?: string;
        hidden?: boolean;
    };
    hidden?: boolean;
    regularPath: string;
};

export function initTags(post: Post[]) {
    const data: any = {};
    for (let i = 0; i < post.length; i++) {
        const element = post[i];
        const tags = element.frontMatter.tags;
        // tags是数组，需要tags按照数组语法的格式书写
        if (Array.isArray(tags)) {
            tags.forEach((item) => {
                if (!data[item]) data[item] = [];
                if (element.hidden && element.frontMatter.hidden) {
                    return;
                }
                data[item].push(element);
            });
        }
    }
    const tags = Object.keys(data);
    tags.forEach(tag => {
        data[tag].forEach((item: any) => {
            const ptags = item.frontMatter.ptags;
            if (Array.isArray(ptags)) {
                ptags.forEach(ptag => {
                    if (ptag !== tag) {
                        data[tag].hasPTag = true;
                    }
                    if (!data[ptag]) data[ptag] = [];
                    if (!data[ptag].childrenTags) data[ptag].childrenTags = {};
                    if (!data[ptag].childrenTags[tag]) data[ptag].childrenTags[tag] = [];
                    data[ptag].childrenTags[tag].push(item);
                })
            } else {
                if (!data[tag].childrenTags) data[tag].childrenTags = {};
                if (!data[tag].childrenTags[tag]) data[tag].childrenTags[tag] = [];
                data[tag].childrenTags[tag].push(item);
            }


        })
    })
    return data;
}

export function useYearSort(post: Post[]) {
    const data = [];
    let year = "0";
    let num = -1;
    for (let index = 0; index < post.length; index++) {
        const element = post[index];
        if (element.frontMatter.date) {
            const y = element.frontMatter.date.split("-")[0];
            if (y === year) {
                data[num].push(element);
            } else {
                num++;
                data[num] = [] as any;
                data[num].push(element);
                year = y;
            }
        }
    }
    return data;
}

export function getHeaders() {
    return [...document.querySelectorAll(".VPDoc h2,h3,h4,h5,h6")]
        .filter((el) => el.id && el.hasChildNodes())
        .map((el) => {
            const level = Number(el.tagName[1]);
            return {
                title: serializeHeader(el),
                link: "#" + el.id,
                level,
            };
        });
}

function serializeHeader(h: Element): string {
    let ret = "";
    for (const node of h.childNodes) {
        if (node.nodeType === 1) {
            if ((node as Element).classList.contains("VPBadge") || (node as Element).classList.contains("header-anchor")) {
                continue;
            }
            ret += node.textContent;
        } else if (node.nodeType === 3) {
            ret += node.textContent;
        }
    }
    return ret.trim();
}
