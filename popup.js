document.getElementById('extractBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const status = document.getElementById('status');
  status.textContent = "抽出中･･･";
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const links = Array.from(document.querySelectorAll('a#video-title-link, a#video-title'))
        .map(a => a.href)
        .filter(href => href && href.includes('watch?v='));
      const uniqueLinks = [...new Set(links)].join('\n');
      const el = document.createElement('textarea');
      el.value = uniqueLinks;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return uniqueLinks.split('\n').length;
    }
  }, (results) => {
    const count = results[0].result;
    status.textContent = count > 0 ? `${count}件コピー完了！` : "動画が見つかりませんでした";
  });
});