# עיצוב מחשבון sechemeter (iframe) כמו Refuah

הקובץ `refuah-theme.css` מתאים את המראה ל־`SechemCalculator` (מחשבון ה־debug) — צבעים, פינות, גבולות, פונט Assistant — בלי לגעת בלוגיקת ה־JS.

## מה לעשות בפרויקט sechemeter (v6.1)

1. **העתק** את `refuah-theme.css` ל־`sechemeter/src/css/`.

2. **ב־`src/css/index.css`** הוסף בשורה האחרונה (אחרי כל ה־`@import`):

   ```css
   @import "refuah-theme.css";
   ```

3. **הפעלת `data-theme="refuah"`** כשטוענים מתוך Refuah — מומלץ עם פרמטר ב־URL כדי שיעבוד גם כש־Referrer מצומצם:

   הוסף **לפני `</body>`** ב־`index.html`:

   ```html
   <script>
     (function () {
       if (new URLSearchParams(location.search).get("refuah") !== "1") return;
       function apply() {
         document.querySelectorAll("[data-theme]").forEach(function (el) {
           el.setAttribute("data-theme", "refuah");
         });
       }
       if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
       else apply();
     })();
   </script>
   ```

4. **בנה והעלה** ל־GitHub Pages (או היכן שהאתר מתארח).

## בצד Refuah

ב־`CalculatorTabs` מוגדר מקור ה־iframe עם `?refuah=1` כדי שהעיצוב יופעל אוטומטית אחרי הפריסה של השינויים למעלה.

אם כתובת הבסיס משתנה, עדכן את הקבוע `EXTERNAL_URL` / `EXTERNAL_BASE` בקוד.
