// Progressive enhancement only. The page is fully readable without this file.
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var code = document.getElementById('install-code');
  var btn = document.getElementById('copy-install');
  if (code && btn) {
    btn.addEventListener('click', function () {
      var text = code.textContent || '';
      var done = function () {
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  }

  // WebMCP: one real tool, returns the install commands rendered on this page.
  try {
    var mc = document.modelContext || navigator.modelContext;
    if (mc && typeof mc.registerTool === 'function' && code) {
      mc.registerTool({
        name: 'get_install_instructions',
        description: 'Returns the commands to install the Infomarchy plugin on an Omarchy desktop, copied from the project README.',
        inputSchema: { type: 'object', properties: {} },
        execute: function () {
          var req = Array.prototype.map.call(document.querySelectorAll('#install-reqs li'), function (li) { return '- ' + li.textContent; }).join('\n');
          return Promise.resolve({
            content: [{ type: 'text', text: 'Requirements:\n' + req + '\n\nInstall:\n' + (code.textContent || '') + '\n\nSource: https://github.com/nixfred/infomarchy' }],
          });
        },
      });
    }
  } catch (e) { /* never break the page */ }
})();
