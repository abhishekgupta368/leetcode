---
comments: true
difficulty: Hard
edit_url: https://github.com/doocs/leetcode/edit/main/solution/2600-2699/2612.Minimum%20Reverse%20Operations/README_EN.md
rating: 2824
source: Weekly Contest 339 Q4
tags:
    - Breadth-First Search
    - Array
    - Ordered Set
---

<!-- problem:start -->

# [2612. Minimum Reverse Operations](https://leetcode.com/problems/minimum-reverse-operations)

[中文文档](/solution/2600-2699/2612.Minimum%20Reverse%20Operations/README.md)

## Description

<!-- description:start -->

<p>You are given an integer <code>n</code> and an integer <code>p</code> representing an array <code>arr</code> of length <code>n</code> where all elements are set to 0&#39;s, except position <code>p</code> which is set to 1. You are also given an integer array <code>banned</code> containing restricted positions. Perform the following operation on <code>arr</code>:</p>

<ul>
	<li>Reverse a <span data-keyword="subarray-nonempty"><strong>subarray</strong></span> with size <code>k</code> if the single 1 is not set to a position in <code>banned</code>.</li>
</ul>

<p>Return an integer array <code>answer</code> with <code>n</code> results where the <code>i<sup>th</sup></code> result is<em> </em>the <strong>minimum</strong> number of operations needed to bring the single 1 to position <code>i</code> in <code>arr</code>, or -1 if it is impossible.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">n = 4, p = 0, banned = [1,2], k = 4</span></p>

<p><strong>Output:</strong> <span class="example-io">[0,-1,-1,1]</span></p>

<p><strong>Explanation:</strong></p>

<ul>
	<li>Initially 1 is placed at position 0 so the number of operations we need for position 0 is 0.</li>
	<li>We can never place 1 on the banned positions, so the answer for positions 1 and 2 is -1.</li>
	<li>Perform the operation of size 4 to reverse the whole array.</li>
	<li>After a single operation 1 is at position 3 so the answer for position 3 is 1.</li>
</ul>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">n = 5, p = 0, banned = [2,4], k = 3</span></p>

<p><strong>Output:</strong> <span class="example-io">[0,-1,-1,-1,-1]</span></p>

<p><strong>Explanation:</strong></p>

<ul>
	<li>Initially 1 is placed at position 0 so the number of operations we need for position 0 is 0.</li>
	<li>We cannot perform the operation on the subarray positions <code>[0, 2]</code> because position 2 is in banned.</li>
	<li>Because 1 cannot be set at position 2, it is impossible to set 1 at other positions in more operations.</li>
</ul>
</div>

<p><strong class="example">Example 3:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">n = 4, p = 2, banned = [0,1,3], k = 1</span></p>

<p><strong>Output:</strong> <span class="example-io">[-1,-1,0,-1]</span></p>

<p><strong>Explanation:</strong></p>

<p>Perform operations of size 1 and 1 never changes its position.</p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>
	<li><code>0 &lt;= p &lt;= n - 1</code></li>
	<li><code>0 &lt;= banned.length &lt;= n - 1</code></li>
	<li><code>0 &lt;= banned[i] &lt;= n - 1</code></li>
	<li><code>1 &lt;= k &lt;= n&nbsp;</code></li>
	<li><code>banned[i] != p</code></li>
	<li>all values in <code>banned</code>&nbsp;are <strong>unique</strong>&nbsp;</li>
</ul>

<!-- description:end -->

## Solutions

<!-- solution:start -->

### Solution 1: Ordered Set + BFS

We notice that for any index $i$ in the subarray interval $[l,..r]$, the flipped index $j = l + r - i$.

If the subarray moves one position to the right, then $j = l + 1 + r + 1 - i = l + r - i + 2$, that is, $j$ will increase by $2$.

Similarly, if the subarray moves one position to the left, then $j = l - 1 + r - 1 - i = l + r - i - 2$, that is, $j$ will decrease by $2$.

Therefore, for a specific index $i$, all its flipped indices form an arithmetic progression with common difference $2$, that is, all the flipped indices have the same parity.

Next, we consider the range of values ​​of the index $i$ after flipping $j$.

-   If the boundary is not considered, the range of values ​​of $j$ is $[i - k + 1, i + k - 1]$.
-   If the subarray is on the left, then $[l, r] = [0, k - 1]$, so the flipped index $j$ of $i$ is $0 + k - 1 - i$, that is, $j = k - i - 1$, so the left boundary $mi = max(i - k + 1, k - i - 1)$.
-   If the subarray is on the right, then $[l, r] = [n - k, n - 1]$, so the flipped index $j= n - k + n - 1 - i$ is $j = n \times 2 - k - i - 1$, so the right boundary of $j$ is $mx = min(i + k - 1, n \times 2 - k - i - 1)$.

We use two ordered sets to store all the odd indices and even indices to be searched, here we need to exclude the indices in the array $banned$ and the index $p$.

Then we use BFS to search, each time searching all the flipped indices $j$ of the current index $i$, that is, $j = mi, mi + 2, mi + 4, \dots, mx$, updating the answer of index $j$ and adding index $j$ to the search queue, and removing index $j$ from the corresponding ordered set.

When the search is over, the answer to all indices can be obtained.

The time complexity is $O(n \times \log n)$ and the space complexity is $O(n)$. Where $n$ is the given array length in the problem.

<!-- tabs:start -->

#### Python3

```python
class Solution:
    def minReverseOperations(
        self, n: int, p: int, banned: List[int], k: int
    ) -> List[int]:
        ans = [-1] * n
        ans[p] = 0
        ts = [SortedSet() for _ in range(2)]
        for i in range(n):
            ts[i % 2].add(i)
        ts[p % 2].remove(p)
        for i in banned:
            ts[i % 2].remove(i)
        ts[0].add(n)
        ts[1].add(n)
        q = deque([p])
        while q:
            i = q.popleft()
            mi = max(i - k + 1, k - i - 1)
            mx = min(i + k - 1, n * 2 - k - i - 1)
            s = ts[mi % 2]
            j = s.bisect_left(mi)
            while s[j] <= mx:
                q.append(s[j])
                ans[s[j]] = ans[i] + 1
                s.remove(s[j])
                j = s.bisect_left(mi)
        return ans
```

#### Java

```java
class Solution {
    public int[] minReverseOperations(int n, int p, int[] banned, int k) {
        int[] ans = new int[n];
        TreeSet<Integer>[] ts = new TreeSet[] {new TreeSet<>(), new TreeSet<>()};
        for (int i = 0; i < n; ++i) {
            ts[i % 2].add(i);
            ans[i] = i == p ? 0 : -1;
        }
        ts[p % 2].remove(p);
        for (int i : banned) {
            ts[i % 2].remove(i);
        }
        ts[0].add(n);
        ts[1].add(n);
        Deque<Integer> q = new ArrayDeque<>();
        q.offer(p);
        while (!q.isEmpty()) {
            int i = q.poll();
            int mi = Math.max(i - k + 1, k - i - 1);
            int mx = Math.min(i + k - 1, n * 2 - k - i - 1);
            var s = ts[mi % 2];
            for (int j = s.ceiling(mi); j <= mx; j = s.ceiling(mi)) {
                q.offer(j);
                ans[j] = ans[i] + 1;
                s.remove(j);
            }
        }
        return ans;
    }
}
```

#### C++

```cpp
class Solution {
public:
    vector<int> minReverseOperations(int n, int p, vector<int>& banned, int k) {
        vector<int> ans(n, -1);
        ans[p] = 0;
        set<int> ts[2];
        for (int i = 0; i < n; ++i) {
            ts[i % 2].insert(i);
        }
        ts[p % 2].erase(p);
        for (int i : banned) {
            ts[i % 2].erase(i);
        }
        ts[0].insert(n);
        ts[1].insert(n);
        queue<int> q{{p}};
        while (!q.empty()) {
            int i = q.front();
            q.pop();
            int mi = max(i - k + 1, k - i - 1);
            int mx = min(i + k - 1, n * 2 - k - i - 1);
            auto& s = ts[mi % 2];
            auto it = s.lower_bound(mi);
            while (*it <= mx) {
                int j = *it;
                ans[j] = ans[i] + 1;
                q.push(j);
                it = s.erase(it);
            }
        }
        return ans;
    }
};
```

#### Go

```go
func minReverseOperations(n int, p int, banned []int, k int) []int {
	ans := make([]int, n)
	ts := [2]*redblacktree.Tree{redblacktree.NewWithIntComparator(), redblacktree.NewWithIntComparator()}
	for i := 0; i < n; i++ {
		ts[i%2].Put(i, struct{}{})
		ans[i] = -1
	}
	ans[p] = 0
	ts[p%2].Remove(p)
	for _, i := range banned {
		ts[i%2].Remove(i)
	}
	ts[0].Put(n, struct{}{})
	ts[1].Put(n, struct{}{})
	q := []int{p}
	for len(q) > 0 {
		i := q[0]
		q = q[1:]
		mi := max(i-k+1, k-i-1)
		mx := min(i+k-1, n*2-k-i-1)
		s := ts[mi%2]
		for x, _ := s.Ceiling(mi); x.Key.(int) <= mx; x, _ = s.Ceiling(mi) {
			j := x.Key.(int)
			s.Remove(j)
			ans[j] = ans[i] + 1
			q = append(q, j)
		}
	}
	return ans
}
```

#### TypeScript

```ts
function minReverseOperations(n: number, p: number, banned: number[], k: number): number[] {
    const ans: number[] = Array(n).fill(-1);
    const ts = [new TreeSet<number>(), new TreeSet<number>()];
    for (let i = 0; i < n; ++i) {
        ts[i % 2].add(i);
    }
    ans[p] = 0;
    ts[p % 2].delete(p);
    for (const i of banned) {
        ts[i % 2].delete(i);
    }
    ts[0].add(n);
    ts[1].add(n);
    let q = [p];
    while (q.length) {
        const t: number[] = [];
        for (const i of q) {
            const mi = Math.max(i - k + 1, k - i - 1);
            const mx = Math.min(i + k - 1, n * 2 - k - i - 1);
            const s = ts[mi % 2];
            for (let j = s.ceil(mi)!; j <= mx; j = s.ceil(j)!) {
                t.push(j);
                ans[j] = ans[i] + 1;
                s.delete(j);
            }
        }
        q = t;
    }
    return ans;
}

type Compare<T> = (lhs: T, rhs: T) => number;

class RBTreeNode<T = number> {
    data: T;
    count: number;
    left: RBTreeNode<T> | null;
    right: RBTreeNode<T> | null;
    parent: RBTreeNode<T> | null;
    color: number;
    constructor(data: T) {
        this.data = data;
        this.left = this.right = this.parent = null;
        this.color = 0;
        this.count = 1;
    }

    sibling(): RBTreeNode<T> | null {
        if (!this.parent) return null; // sibling null if no parent
        return this.isOnLeft() ? this.parent.right : this.parent.left;
    }

    isOnLeft(): boolean {
        return this === this.parent!.left;
    }

    hasRedChild(): boolean {
        return (
            Boolean(this.left && this.left.color === 0) ||
            Boolean(this.right && this.right.color === 0)
        );
    }
}

class RBTree<T> {
    root: RBTreeNode<T> | null;
    lt: (l: T, r: T) => boolean;
    constructor(compare: Compare<T> = (l: T, r: T) => (l < r ? -1 : l > r ? 1 : 0)) {
        this.root = null;
        this.lt = (l: T, r: T) => compare(l, r) < 0;
    }

    rotateLeft(pt: RBTreeNode<T>): void {
        const right = pt.right!;
        pt.right = right.left;

        if (pt.right) pt.right.parent = pt;
        right.parent = pt.parent;

        if (!pt.parent) this.root = right;
        else if (pt === pt.parent.left) pt.parent.left = right;
        else pt.parent.right = right;

        right.left = pt;
        pt.parent = right;
    }

    rotateRight(pt: RBTreeNode<T>): void {
        const left = pt.left!;
        pt.left = left.right;

        if (pt.left) pt.left.parent = pt;
        left.parent = pt.parent;

        if (!pt.parent) this.root = left;
        else if (pt === pt.parent.left) pt.parent.left = left;
        else pt.parent.right = left;

        left.right = pt;
        pt.parent = left;
    }

    swapColor(p1: RBTreeNode<T>, p2: RBTreeNode<T>): void {
        const tmp = p1.color;
        p1.color = p2.color;
        p2.color = tmp;
    }

    swapData(p1: RBTreeNode<T>, p2: RBTreeNode<T>): void {
        const tmp = p1.data;
        p1.data = p2.data;
        p2.data = tmp;
    }

    fixAfterInsert(pt: RBTreeNode<T>): void {
        let parent = null;
        let grandParent = null;

        while (pt !== this.root && pt.color !== 1 && pt.parent?.color === 0) {
            parent = pt.parent;
            grandParent = pt.parent.parent;

            /*  Case : A
                Parent of pt is left child of Grand-parent of pt */
            if (parent === grandParent?.left) {
                const uncle = grandParent.right;

                /* Case : 1
                   The uncle of pt is also red
                   Only Recoloring required */
                if (uncle && uncle.color === 0) {
                    grandParent.color = 0;
                    parent.color = 1;
                    uncle.color = 1;
                    pt = grandParent;
                } else {
                    /* Case : 2
                       pt is right child of its parent
                       Left-rotation required */
                    if (pt === parent.right) {
                        this.rotateLeft(parent);
                        pt = parent;
                        parent = pt.parent;
                    }

                    /* Case : 3
                       pt is left child of its parent
                       Right-rotation required */
                    this.rotateRight(grandParent);
                    this.swapColor(parent!, grandParent);
                    pt = parent!;
                }
            } else {
                /* Case : B
               Parent of pt is right child of Grand-parent of pt */
                const uncle = grandParent!.left;

                /*  Case : 1
                    The uncle of pt is also red
                    Only Recoloring required */
                if (uncle != null && uncle.color === 0) {
                    grandParent!.color = 0;
                    parent.color = 1;
                    uncle.color = 1;
                    pt = grandParent!;
                } else {
                    /* Case : 2
                       pt is left child of its parent
                       Right-rotation required */
                    if (pt === parent.left) {
                        this.rotateRight(parent);
                        pt = parent;
                        parent = pt.parent;
                    }

                    /* Case : 3
                       pt is right child of its parent
                       Left-rotation required */
                    this.rotateLeft(grandParent!);
                    this.swapColor(parent!, grandParent!);
                    pt = parent!;
                }
            }
        }
        this.root!.color = 1;
    }

    delete(val: T): boolean {
        const node = this.find(val);
        if (!node) return false;
        node.count--;
        if (!node.count) this.deleteNode(node);
        return true;
    }

    deleteAll(val: T): boolean {
        const node = this.find(val);
        if (!node) return false;
        this.deleteNode(node);
        return true;
    }

    deleteNode(v: RBTreeNode<T>): void {
        const u = BSTreplace(v);

        // True when u and v are both black
        const uvBlack = (u === null || u.color === 1) && v.color === 1;
        const parent = v.parent!;

        if (!u) {
            // u is null therefore v is leaf
            if (v === this.root) this.root = null;
            // v is root, making root null
            else {
                if (uvBlack) {
                    // u and v both black
                    // v is leaf, fix double black at v
                    this.fixDoubleBlack(v);
                } else {
                    // u or v is red
                    if (v.sibling()) {
                        // sibling is not null, make it red"
                        v.sibling()!.color = 0;
                    }
                }
                // delete v from the tree
                if (v.isOnLeft()) parent.left = null;
                else parent.right = null;
            }
            return;
        }

        if (!v.left || !v.right) {
            // v has 1 child
            if (v === this.root) {
                // v is root, assign the value of u to v, and delete u
                v.data = u.data;
                v.left = v.right = null;
            } else {
                // Detach v from tree and move u up
                if (v.isOnLeft()) parent.left = u;
                else parent.right = u;
                u.parent = parent;
                if (uvBlack) this.fixDoubleBlack(u);
                // u and v both black, fix double black at u
                else u.color = 1; // u or v red, color u black
            }
            return;
        }

        // v has 2 children, swap data with successor and recurse
        this.swapData(u, v);
        this.deleteNode(u);

        // find node that replaces a deleted node in BST
        function BSTreplace(x: RBTreeNode<T>): RBTreeNode<T> | null {
            // when node have 2 children
            if (x.left && x.right) return successor(x.right);
            // when leaf
            if (!x.left && !x.right) return null;
            // when single child
            return x.left ?? x.right;
        }
        // find node that do not have a left child
        // in the subtree of the given node
        function successor(x: RBTreeNode<T>): RBTreeNode<T> {
            let temp = x;
            while (temp.left) temp = temp.left;
            return temp;
        }
    }

    fixDoubleBlack(x: RBTreeNode<T>): void {
        if (x === this.root) return; // Reached root

        const sibling = x.sibling();
        const parent = x.parent!;
        if (!sibling) {
            // No sibiling, double black pushed up
            this.fixDoubleBlack(parent);
        } else {
            if (sibling.color === 0) {
                // Sibling red
                parent.color = 0;
                sibling.color = 1;
                if (sibling.isOnLeft()) this.rotateRight(parent);
                // left case
                else this.rotateLeft(parent); // right case
                this.fixDoubleBlack(x);
            } else {
                // Sibling black
                if (sibling.hasRedChild()) {
                    // at least 1 red children
                    if (sibling.left && sibling.left.color === 0) {
                        if (sibling.isOnLeft()) {
                            // left left
                            sibling.left.color = sibling.color;
                            sibling.color = parent.color;
                            this.rotateRight(parent);
                        } else {
                            // right left
                            sibling.left.color = parent.color;
                            this.rotateRight(sibling);
                            this.rotateLeft(parent);
                        }
                    } else {
                        if (sibling.isOnLeft()) {
                            // left right
                            sibling.right!.color = parent.color;
                            this.rotateLeft(sibling);
                            this.rotateRight(parent);
                        } else {
                            // right right
                            sibling.right!.color = sibling.color;
                            sibling.color = parent.color;
                            this.rotateLeft(parent);
                        }
                    }
                    parent.color = 1;
                } else {
                    // 2 black children
                    sibling.color = 0;
                    if (parent.color === 1) this.fixDoubleBlack(parent);
                    else parent.color = 1;
                }
            }
        }
    }

    insert(data: T): boolean {
        // search for a position to insert
        let parent = this.root;
        while (parent) {
            if (this.lt(data, parent.data)) {
                if (!parent.left) break;
                else parent = parent.left;
            } else if (this.lt(parent.data, data)) {
                if (!parent.right) break;
                else parent = parent.right;
            } else break;
        }

        // insert node into parent
        const node = new RBTreeNode(data);
        if (!parent) this.root = node;
        else if (this.lt(node.data, parent.data)) parent.left = node;
        else if (this.lt(parent.data, node.data)) parent.right = node;
        else {
            parent.count++;
            return false;
        }
        node.parent = parent;
        this.fixAfterInsert(node);
        return true;
    }

    find(data: T): RBTreeNode<T> | null {
        let p = this.root;
        while (p) {
            if (this.lt(data, p.data)) {
                p = p.left;
            } else if (this.lt(p.data, data)) {
                p = p.right;
            } else break;
        }
        return p ?? null;
    }

    *inOrder(root: RBTreeNode<T> = this.root!): Generator<T, undefined, void> {
        if (!root) return;
        for (const v of this.inOrder(root.left!)) yield v;
        yield root.data;
        for (const v of this.inOrder(root.right!)) yield v;
    }

    *reverseInOrder(root: RBTreeNode<T> = this.root!): Generator<T, undefined, void> {
        if (!root) return;
        for (const v of this.reverseInOrder(root.right!)) yield v;
        yield root.data;
        for (const v of this.reverseInOrder(root.left!)) yield v;
    }
}

class TreeSet<T = number> {
    _size: number;
    tree: RBTree<T>;
    compare: Compare<T>;
    constructor(
        collection: T[] | Compare<T> = [],
        compare: Compare<T> = (l: T, r: T) => (l < r ? -1 : l > r ? 1 : 0),
    ) {
        if (typeof collection === 'function') {
            compare = collection;
            collection = [];
        }
        this._size = 0;
        this.compare = compare;
        this.tree = new RBTree(compare);
        for (const val of collection) this.add(val);
    }

    size(): number {
        return this._size;
    }

    has(val: T): boolean {
        return !!this.tree.find(val);
    }

    add(val: T): boolean {
        const successful = this.tree.insert(val);
        this._size += successful ? 1 : 0;
        return successful;
    }

    delete(val: T): boolean {
        const deleted = this.tree.deleteAll(val);
        this._size -= deleted ? 1 : 0;
        return deleted;
    }

    ceil(val: T): T | undefined {
        let p = this.tree.root;
        let higher = null;
        while (p) {
            if (this.compare(p.data, val) >= 0) {
                higher = p;
                p = p.left;
            } else {
                p = p.right;
            }
        }
        return higher?.data;
    }

    floor(val: T): T | undefined {
        let p = this.tree.root;
        let lower = null;
        while (p) {
            if (this.compare(val, p.data) >= 0) {
                lower = p;
                p = p.right;
            } else {
                p = p.left;
            }
        }
        return lower?.data;
    }

    higher(val: T): T | undefined {
        let p = this.tree.root;
        let higher = null;
        while (p) {
            if (this.compare(val, p.data) < 0) {
                higher = p;
                p = p.left;
            } else {
                p = p.right;
            }
        }
        return higher?.data;
    }

    lower(val: T): T | undefined {
        let p = this.tree.root;
        let lower = null;
        while (p) {
            if (this.compare(p.data, val) < 0) {
                lower = p;
                p = p.right;
            } else {
                p = p.left;
            }
        }
        return lower?.data;
    }

    first(): T | undefined {
        return this.tree.inOrder().next().value;
    }

    last(): T | undefined {
        return this.tree.reverseInOrder().next().value;
    }

    shift(): T | undefined {
        const first = this.first();
        if (first === undefined) return undefined;
        this.delete(first);
        return first;
    }

    pop(): T | undefined {
        const last = this.last();
        if (last === undefined) return undefined;
        this.delete(last);
        return last;
    }

    *[Symbol.iterator](): Generator<T, void, void> {
        for (const val of this.values()) yield val;
    }

    *keys(): Generator<T, void, void> {
        for (const val of this.values()) yield val;
    }

    *values(): Generator<T, undefined, void> {
        for (const val of this.tree.inOrder()) yield val;
        return undefined;
    }

    /**
     * Return a generator for reverse order traversing the set
     */
    *rvalues(): Generator<T, undefined, void> {
        for (const val of this.tree.reverseInOrder()) yield val;
        return undefined;
    }
}

class TreeMultiSet<T = number> {
    _size: number;
    tree: RBTree<T>;
    compare: Compare<T>;
    constructor(
        collection: T[] | Compare<T> = [],
        compare: Compare<T> = (l: T, r: T) => (l < r ? -1 : l > r ? 1 : 0),
    ) {
        if (typeof collection === 'function') {
            compare = collection;
            collection = [];
        }
        this._size = 0;
        this.compare = compare;
        this.tree = new RBTree(compare);
        for (const val of collection) this.add(val);
    }

    size(): number {
        return this._size;
    }

    has(val: T): boolean {
        return !!this.tree.find(val);
    }

    add(val: T): boolean {
        const successful = this.tree.insert(val);
        this._size++;
        return successful;
    }

    delete(val: T): boolean {
        const successful = this.tree.delete(val);
        if (!successful) return false;
        this._size--;
        return true;
    }

    count(val: T): number {
        const node = this.tree.find(val);
        return node ? node.count : 0;
    }

    ceil(val: T): T | undefined {
        let p = this.tree.root;
        let higher = null;
        while (p) {
            if (this.compare(p.data, val) >= 0) {
                higher = p;
                p = p.left;
            } else {
                p = p.right;
            }
        }
        return higher?.data;
    }

    floor(val: T): T | undefined {
        let p = this.tree.root;
        let lower = null;
        while (p) {
            if (this.compare(val, p.data) >= 0) {
                lower = p;
                p = p.right;
            } else {
                p = p.left;
            }
        }
        return lower?.data;
    }

    higher(val: T): T | undefined {
        let p = this.tree.root;
        let higher = null;
        while (p) {
            if (this.compare(val, p.data) < 0) {
                higher = p;
                p = p.left;
            } else {
                p = p.right;
            }
        }
        return higher?.data;
    }

    lower(val: T): T | undefined {
        let p = this.tree.root;
        let lower = null;
        while (p) {
            if (this.compare(p.data, val) < 0) {
                lower = p;
                p = p.right;
            } else {
                p = p.left;
            }
        }
        return lower?.data;
    }

    first(): T | undefined {
        return this.tree.inOrder().next().value;
    }

    last(): T | undefined {
        return this.tree.reverseInOrder().next().value;
    }

    shift(): T | undefined {
        const first = this.first();
        if (first === undefined) return undefined;
        this.delete(first);
        return first;
    }

    pop(): T | undefined {
        const last = this.last();
        if (last === undefined) return undefined;
        this.delete(last);
        return last;
    }

    *[Symbol.iterator](): Generator<T, void, void> {
        yield* this.values();
    }

    *keys(): Generator<T, void, void> {
        for (const val of this.values()) yield val;
    }

    *values(): Generator<T, undefined, void> {
        for (const val of this.tree.inOrder()) {
            let count = this.count(val);
            while (count--) yield val;
        }
        return undefined;
    }

    /**
     * Return a generator for reverse order traversing the multi-set
     */
    *rvalues(): Generator<T, undefined, void> {
        for (const val of this.tree.reverseInOrder()) {
            let count = this.count(val);
            while (count--) yield val;
        }
        return undefined;
    }
}
```

#### Rust

```rust
use std::collections::{BTreeSet, VecDeque};

impl Solution {
    pub fn min_reverse_operations(n: i32, p: i32, banned: Vec<i32>, k: i32) -> Vec<i32> {
        let mut ans = vec![-1; n as usize];
        let mut ts = [BTreeSet::new(), BTreeSet::new()];

        for i in 0..n {
            ts[(i % 2) as usize].insert(i);
        }
        ans[p as usize] = 0;
        ts[(p % 2) as usize].remove(&p);

        for &b in &banned {
            ts[(b % 2) as usize].remove(&b);
        }

        ts[0].insert(n);
        ts[1].insert(n);
        let mut q = VecDeque::new();
        q.push_back(p);

        while let Some(i) = q.pop_front() {
            let mi = (i - k + 1).max(k - i - 1);
            let mx = (i + k - 1).min(2 * n - k - i - 1);
            let s = &mut ts[(mi % 2) as usize];

            while let Some(&j) = s.range(mi..=mx).next() {
                q.push_back(j);
                ans[j as usize] = ans[i as usize] + 1;
                s.remove(&j);
            }
        }

        ans
    }
}
```

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->
