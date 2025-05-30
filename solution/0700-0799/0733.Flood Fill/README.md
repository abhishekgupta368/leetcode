---
comments: true
difficulty: 简单
edit_url: https://github.com/doocs/leetcode/edit/main/solution/0700-0799/0733.Flood%20Fill/README.md
tags:
    - 深度优先搜索
    - 广度优先搜索
    - 数组
    - 矩阵
---

<!-- problem:start -->

# [733. 图像渲染](https://leetcode.cn/problems/flood-fill)

[English Version](/solution/0700-0799/0733.Flood%20Fill/README_EN.md)

## 题目描述

<!-- description:start -->

<p>有一幅以&nbsp;<code>m x n</code>&nbsp;的二维整数数组表示的图画&nbsp;<code>image</code>&nbsp;，其中&nbsp;<code>image[i][j]</code>&nbsp;表示该图画的像素值大小。你也被给予三个整数 <code>sr</code> ,&nbsp; <code>sc</code> 和 <code>color</code> 。你应该从像素&nbsp;<code>image[sr][sc]</code>&nbsp;开始对图像进行上色&nbsp;<strong>填充</strong> 。</p>

<p>为了完成 <strong>上色工作</strong>：</p>

<ol>
	<li>从初始像素开始，将其颜色改为 <code>color</code>。</li>
	<li>对初始坐标的 <strong>上下左右四个方向上</strong> 相邻且与初始像素的原始颜色同色的像素点执行相同操作。</li>
	<li>通过检查与初始像素的原始颜色相同的相邻像素并修改其颜色来继续 <strong>重复</strong> 此过程。</li>
	<li>当 <strong>没有</strong> 其它原始颜色的相邻像素时 <strong>停止</strong> 操作。</li>
</ol>

<p>最后返回经过上色渲染&nbsp;<strong>修改</strong> 后的图像&nbsp;。</p>

<p>&nbsp;</p>

<p><strong>示例 1:</strong></p>

<p><img src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0700-0799/0733.Flood%20Fill/images/flood1-grid.jpg" /></p>

<div class="example-block"><strong>输入：</strong>image = [[1,1,1],[1,1,0],[1,0,1]]，sr = 1, sc = 1, color = 2</div>

<div class="example-block"><strong>输出：</strong>[[2,2,2],[2,2,0],[2,0,1]]</div>

<div class="example-block"><b>解释：</b>在图像的正中间，坐标 <code>(sr,sc)=(1,1)</code>&nbsp;（即红色像素）,在路径上所有符合条件的像素点的颜色都被更改成相同的新颜色（即蓝色像素）。</div>

<div class="example-block">注意，右下角的像素 <strong>没有</strong> 更改为2，因为它不是在上下左右四个方向上与初始点相连的像素点。</div>

<div class="example-block">&nbsp;</div>

<p><strong>示例 2:</strong></p>

<div class="example-block"><strong>输入：</strong>image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0</div>

<div class="example-block"><strong>输出：</strong>[[0,0,0],[0,0,0]]</div>

<div class="example-block"><strong>解释：</strong>初始像素已经用 0 着色，这与目标颜色相同。因此，不会对图像进行任何更改。</div>

<p>&nbsp;</p>

<p><strong>提示:</strong></p>

<ul>
	<li><code>m == image.length</code></li>
	<li><code>n == image[i].length</code></li>
	<li><code>1 &lt;= m, n &lt;= 50</code></li>
	<li><code>0 &lt;= image[i][j], color &lt; 2<sup>16</sup></code></li>
	<li><code>0 &lt;= sr &lt;&nbsp;m</code></li>
	<li><code>0 &lt;= sc &lt;&nbsp;n</code></li>
</ul>

<!-- description:end -->

## 解法

<!-- solution:start -->

### 方法一：DFS

我们记初始像素的颜色为 $\textit{oc}$，如果 $\textit{oc}$ 不等于目标颜色 $\textit{color}$，我们就从 $(\textit{sr}, \textit{sc})$ 开始深度优先搜索，将所有符合条件的像素点的颜色都更改成目标颜色。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别为二维数组 $\textit{image}$ 的行数和列数。

<!-- tabs:start -->

#### Python3

```python
class Solution:
    def floodFill(
        self, image: List[List[int]], sr: int, sc: int, color: int
    ) -> List[List[int]]:
        def dfs(i: int, j: int):
            image[i][j] = color
            for a, b in pairwise(dirs):
                x, y = i + a, j + b
                if 0 <= x < len(image) and 0 <= y < len(image[0]) and image[x][y] == oc:
                    dfs(x, y)

        oc = image[sr][sc]
        if oc != color:
            dirs = (-1, 0, 1, 0, -1)
            dfs(sr, sc)
        return image
```

#### Java

```java
class Solution {
    private int[][] image;
    private int oc;
    private int color;
    private final int[] dirs = {-1, 0, 1, 0, -1};

    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        oc = image[sr][sc];
        if (oc == color) {
            return image;
        }
        this.image = image;
        this.color = color;
        dfs(sr, sc);
        return image;
    }

    private void dfs(int i, int j) {
        image[i][j] = color;
        for (int k = 0; k < 4; ++k) {
            int x = i + dirs[k], y = j + dirs[k + 1];
            if (x >= 0 && x < image.length && y >= 0 && y < image[0].length && image[x][y] == oc) {
                dfs(x, y);
            }
        }
    }
}
```

#### C++

```cpp
class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        int m = image.size(), n = image[0].size();
        int oc = image[sr][sc];
        if (oc == color) {
            return image;
        }
        const int dirs[5] = {-1, 0, 1, 0, -1};
        auto dfs = [&](this auto&& dfs, int i, int j) -> void {
            image[i][j] = color;
            for (int k = 0; k < 4; ++k) {
                int x = i + dirs[k], y = j + dirs[k + 1];
                if (x >= 0 && x < m && y >= 0 && y < n && image[x][y] == oc) {
                    dfs(x, y);
                }
            }
        };
        dfs(sr, sc);
        return image;
    }
};
```

#### Go

```go
func floodFill(image [][]int, sr int, sc int, color int) [][]int {
	m, n := len(image), len(image[0])
	oc := image[sr][sc]
	if oc == color {
		return image
	}

	dirs := []int{-1, 0, 1, 0, -1}

	var dfs func(i, j int)
	dfs = func(i, j int) {
		image[i][j] = color
		for k := 0; k < 4; k++ {
			x, y := i+dirs[k], j+dirs[k+1]
			if x >= 0 && x < m && y >= 0 && y < n && image[x][y] == oc {
				dfs(x, y)
			}
		}
	}

	dfs(sr, sc)
	return image
}
```

#### TypeScript

```ts
function floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {
    const [m, n] = [image.length, image[0].length];
    const oc = image[sr][sc];
    if (oc === color) {
        return image;
    }

    const dirs = [-1, 0, 1, 0, -1];

    const dfs = (i: number, j: number): void => {
        image[i][j] = color;
        for (let k = 0; k < 4; k++) {
            const [x, y] = [i + dirs[k], j + dirs[k + 1]];
            if (x >= 0 && x < m && y >= 0 && y < n && image[x][y] === oc) {
                dfs(x, y);
            }
        }
    };

    dfs(sr, sc);
    return image;
}
```

#### Rust

```rust
impl Solution {
    pub fn flood_fill(mut image: Vec<Vec<i32>>, sr: i32, sc: i32, color: i32) -> Vec<Vec<i32>> {
        let m = image.len();
        let n = image[0].len();
        let sr = sr as usize;
        let sc = sc as usize;

        let oc = image[sr][sc];
        if oc == color {
            return image;
        }
        let dirs = [-1, 0, 1, 0, -1];
        fn dfs(
            image: &mut Vec<Vec<i32>>,
            i: usize,
            j: usize,
            oc: i32,
            color: i32,
            m: usize,
            n: usize,
            dirs: &[i32; 5],
        ) {
            image[i][j] = color;
            for k in 0..4 {
                let x = i as isize + dirs[k] as isize;
                let y = j as isize + dirs[k + 1] as isize;
                if x >= 0 && x < m as isize && y >= 0 && y < n as isize {
                    let x = x as usize;
                    let y = y as usize;
                    if image[x][y] == oc {
                        dfs(image, x, y, oc, color, m, n, dirs);
                    }
                }
            }
        }

        dfs(&mut image, sr, sc, oc, color, m, n, &dirs);
        image
    }
}
```

<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

### 方法二：BFS

我们首先判断初始像素的颜色是否等于目标颜色，如果等于，直接返回原图像。否则，我们可以使用广度优先搜索的方法，从 $(\textit{sr}, \textit{sc})$ 开始，将所有符合条件的像素点的颜色都更改成目标颜色。

具体地，我们定义一个队列 $\textit{q}$，将初始像素 $(\textit{sr}, \textit{sc})$ 加入队列。然后我们不断从队列中取出像素点 $(i, j)$，将其颜色更改成目标颜色，并将其上下左右四个方向上与初始像素的原始颜色相同的像素点加入队列。直到队列为空，我们就完成了图像的渲染。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别为二维数组 $\textit{image}$ 的行数和列数。

<!-- tabs:start -->

#### Python3

```python
class Solution:
    def floodFill(
        self, image: List[List[int]], sr: int, sc: int, color: int
    ) -> List[List[int]]:
        if image[sr][sc] == color:
            return image
        q = deque([(sr, sc)])
        oc = image[sr][sc]
        image[sr][sc] = color
        dirs = (-1, 0, 1, 0, -1)
        while q:
            i, j = q.popleft()
            for a, b in pairwise(dirs):
                x, y = i + a, j + b
                if 0 <= x < len(image) and 0 <= y < len(image[0]) and image[x][y] == oc:
                    q.append((x, y))
                    image[x][y] = color
        return image
```

#### Java

```java
class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        if (image[sr][sc] == color) {
            return image;
        }
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[] {sr, sc});
        int oc = image[sr][sc];
        image[sr][sc] = color;
        int[] dirs = {-1, 0, 1, 0, -1};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            int i = p[0], j = p[1];
            for (int k = 0; k < 4; ++k) {
                int x = i + dirs[k], y = j + dirs[k + 1];
                if (x >= 0 && x < image.length && y >= 0 && y < image[0].length
                    && image[x][y] == oc) {
                    q.offer(new int[] {x, y});
                    image[x][y] = color;
                }
            }
        }
        return image;
    }
}
```

#### C++

```cpp
class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        if (image[sr][sc] == color) return image;
        int oc = image[sr][sc];
        image[sr][sc] = color;
        queue<pair<int, int>> q;
        q.push({sr, sc});
        int dirs[5] = {-1, 0, 1, 0, -1};
        while (!q.empty()) {
            auto [a, b] = q.front();
            q.pop();
            for (int k = 0; k < 4; ++k) {
                int x = a + dirs[k];
                int y = b + dirs[k + 1];
                if (x >= 0 && x < image.size() && y >= 0 && y < image[0].size() && image[x][y] == oc) {
                    q.push({x, y});
                    image[x][y] = color;
                }
            }
        }
        return image;
    }
};
```

#### Go

```go
func floodFill(image [][]int, sr int, sc int, color int) [][]int {
	if image[sr][sc] == color {
		return image
	}
	oc := image[sr][sc]
	q := [][]int{[]int{sr, sc}}
	image[sr][sc] = color
	dirs := []int{-1, 0, 1, 0, -1}
	for len(q) > 0 {
		p := q[0]
		q = q[1:]
		for k := 0; k < 4; k++ {
			x, y := p[0]+dirs[k], p[1]+dirs[k+1]
			if x >= 0 && x < len(image) && y >= 0 && y < len(image[0]) && image[x][y] == oc {
				q = append(q, []int{x, y})
				image[x][y] = color
			}
		}
	}
	return image
}
```

#### TypeScript

```ts
function floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {
    if (image[sr][sc] === color) {
        return image;
    }

    const oc = image[sr][sc];
    image[sr][sc] = color;

    const q: [number, number][] = [];
    q.push([sr, sc]);

    const dirs = [-1, 0, 1, 0, -1];
    const [m, n] = [image.length, image[0].length];

    while (q.length > 0) {
        const [a, b] = q.shift()!;
        for (let k = 0; k < 4; ++k) {
            const x = a + dirs[k];
            const y = b + dirs[k + 1];
            if (x >= 0 && x < m && y >= 0 && y < n && image[x][y] === oc) {
                q.push([x, y]);
                image[x][y] = color;
            }
        }
    }

    return image;
}
```

#### Rust

```rust
use std::collections::VecDeque;

impl Solution {
    pub fn flood_fill(mut image: Vec<Vec<i32>>, sr: i32, sc: i32, color: i32) -> Vec<Vec<i32>> {
        let m = image.len();
        let n = image[0].len();
        let (sr, sc) = (sr as usize, sc as usize);

        if image[sr][sc] == color {
            return image;
        }

        let oc = image[sr][sc];
        image[sr][sc] = color;

        let mut q = VecDeque::new();
        q.push_back((sr, sc));

        let dirs = [-1, 0, 1, 0, -1];

        while let Some((i, j)) = q.pop_front() {
            for k in 0..4 {
                let x = i as isize + dirs[k] as isize;
                let y = j as isize + dirs[k + 1] as isize;

                if x >= 0 && x < m as isize && y >= 0 && y < n as isize {
                    let (x, y) = (x as usize, y as usize);
                    if image[x][y] == oc {
                        q.push_back((x, y));
                        image[x][y] = color;
                    }
                }
            }
        }

        image
    }
}
```

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->
