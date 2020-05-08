function save_list(path, list) {
	sessionStorage.setItem(path, list);
}
function load_list(path) {
	return sessionStorage.getItem(path);
}
function get_list(path, target_ID)
{
	const listPath = `${path}/list.txt`;
	const savedList = load_list(listPath);
	if(savedList != undefined) {
		paint_list(path, savedList, target_ID);
		return;
	}
	document.getElementById(target_ID).innerHTML = "<div>....</div>";
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.open("get", listPath);
	xmlhttp.onload = function()
	{
		const list = this.responseText;
		save_list(listPath, list);
		paint_list(path, list, target_ID);
	}
	xmlhttp.send();
}
function paint_list(path, list, target_ID) {
	if(path != get_path())
		set_url(path);
	echo_list(list, target_ID);
}

function set_url(path)
{
	const url = `#${path}`;
	window.history.pushState({url:url},'',url);
}

window.onpopstate = function ()
{
	const S = window.history.state;
	if(S)
	{
		get_list(get_path(), "main");
	}
}

function get_path()
{
	const h = window.location.hash.substr(1);
	if (h == "") return ".";
	return h;
}

function echo_list(list, target_ID)
{
	list = list.split("\n");
	let html = "",
	    path = get_path(),
	    back = (path==".") ? "" : path.split("/").slice(0, path.split("/").length-1).join("/"),
	    pathNew = path,
	    onClick = "",
	    href = "";
	if (back !== "")
	{
		html += `<a href='#${back}' style='font-weight:bold'
onclick='event.preventDefault();get_list("${back}", "main");'>&lsaquo; گەڕانەوە</a>`;
	}
	
	for (let i in list)
	{
		pathNew = path + "/" + list[i];
		href = pathNew.split("/").length < navLevel ? `#${pathNew}` : `${pathNew}`;
		onClick = pathNew.split("/").length < navLevel ? `event.preventDefault();get_list("${pathNew}", "main");` : "";
		list[i] = list[i].replace(/\.mp[34]|\.3gp/gi, '');
		list[i] = KurdishNumbers(list[i]);
		html += `<a href='${href}' onclick='${onClick}'>&rsaquo; ${list[i]}</a>`;
	}
	
	document.getElementById(target_ID).innerHTML = html;
}

function filter(needle)
{
	const context = document.getElementById("main").querySelectorAll("a");
	filterp(needle, context);
}

function filterp(needle="", context, lastChance=false)
{
	var res = false;
	
	needle = san_data(needle, lastChance);
	
	context.forEach(function(item) {
		var cx = san_data(item.innerHTML, lastChance);
		var _filterp = (needle == "") ? true : (cx.indexOf(needle) !== -1);
		if (_filterp) {
			item.style.display = "";
			res = true;
		}
		else {
			item.style.display = "none";
			res = false;
		}
	});

	if(!res && !lastChance)
		filterp(needle, context, true);
}

function KurdishNumbers(inp="")
{
	
	const en = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g],
	      ar = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
	      ku = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	for (let i in en)
	{
		inp = inp.replace(en[i], ku[i]);
		inp = inp.replace(ar[i], ku[i]);
	}
	
	return inp;
}

function san_data(inp="", lastChance=false)
{
	if (inp == "") return "";

	const extras = [/&laquo;/g, /&raquo;/g, /&rsaquo;/g, /&lsaquo;/g, /&bull;/g,
			/&nbsp;/g, /\?/g, /!/g, /#/g, /&/g, /\*/g, /\(/g, /\)/g, /-/g,
			/\+/g, /=/g, /_/g, /\[/g, /\]/g, /{/g, /}/g, /</g, />/g, /\//g,
			/\|/, /\'/g, /\"/g, /;/g, /:/g, /,/g, /\./g, /~/g, /`/g, /؟/g, /،/g,
			/»/g, /«/g, /ـ/g, /›/g, /‹/g, /•/g, /‌/g, /\s+/g, /؛/g,];
	const ar_signs = ['ِ', 'ُ', 'ٓ', 'ٰ', 'ْ', 'ٌ', 'ٍ', 'ً', 'ّ', 'َ'];
	const kurdish_letters = [
		"ه",
		"ه",
		"ک",
		"ی",
		"ه",
		"ز",
		"س",
		"ت",
		"ز",
		"ر",
		"ه",
		"خ",
		"و",
		"و",
		"و",
		"ی",
		"ر",
		"ل",
		"ز",
		"س",
		"ه",
		"ر",
		"م",
		"ا",
		"ا",
		"ل",
		"س",
		"ی",
		"و",
		"ئ",
		"ی",
	];

	const other_letters = [
		/ه‌/g,
		/ە/g,
		/ك/g,
		/ي/g,
		/ھ/g,
		/ض/g,
		/ص/g,
		/ط/g,
		/ظ/g,
		/ڕ/g,
		/ح/g,
		/غ/g,
		/وو/g,
		/ۆ/g,
		/ؤ/g,
		/ێ/g,
		/ڕ/g,
		/ڵ/g,
		/ذ/g,
		/ث/g,
		/ة/g,
		/رر/g,
		/مم/g,
		/أ/g,
		/آ/g,
		/لل/g,
		/سس/g,
		/یی/g,
		/ڤ/g,
		/ع/g,
		/ى/g,
	];
	let i = 0;
	for (i in extras)
	{
		inp = inp.replace(extras[i], "");
	}
	
	for (i in ar_signs)
	{
		inp = inp.replace(ar_signs[i], "");
	}

	for (i in kurdish_letters)
	{
		inp = inp.replace(other_letters[i], kurdish_letters[i]);
	}

	inp = KurdishNumbers(inp);

	if (lastChance) inp = inp.replace(/ه/g, "");

	return inp;
}
const bodyEl = document.body
function resizeToPerfect (el) {
	const fs = Math.sqrt(Math.sqrt(window.innerWidth)) + 12
	el.style.fontSize = `${fs}px`
}
window.addEventListener('load',  function () {
	resizeToPerfect(bodyEl)
})
window.addEventListener('resize',  function () {
	resizeToPerfect(bodyEl)
})
