function mostFrequent(nums: number[], key: number): number {
    const cnt: number[] = Array(Math.max(...nums) + 1).fill(0);
    let [ans, mx] = [0, 0];
    for (let i = 0; i < nums.length - 1; ++i) {
        if (nums[i] === key) {
            if (mx < ++cnt[nums[i + 1]]) {
                mx = cnt[nums[i + 1]];
                ans = nums[i + 1];
            }
        }
    }
    return ans;
}
