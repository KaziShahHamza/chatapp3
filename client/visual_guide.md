# CampusBoard Visual Style Guide

## 1. Color Palette

| Type       | Color       | Tailwind                                      |
| ---------- | ----------- | --------------------------------------------- |
| Primary    | Deep Blue   | `#213448` → `bg-primary`, `text-primary`      |
| Secondary  | Teal/Slate  | `#547792` → `bg-secondary`, `text-secondary`  |
| Accent     | Soft Cyan   | `#94B4C1` → `bg-accent`, `text-accent`        |
| Background | Light Beige | `#EAE0CF` → `bg-background`                   |
| Success    | Green       | `#16A34A` → `bg-green-100 / text-green-600`   |
| Warning    | Yellow      | `#FACC15` → `bg-yellow-100 / text-yellow-600` |
| Error      | Red         | `#F87171` → `bg-red-100 / text-red-600`       |
| Gray Text  | Medium Gray | `#6B7280` → `text-gray-600`                   |
| Border     | Light Gray  | `#E5E7EB` → `border-gray-200`                 |

## 2. Typography

| Element    | Font               | Tailwind Class              | Notes                              |
| ---------- | ------------------ | --------------------------- | ---------------------------------- |
| Headings   | Inter / Poppins    | `font-semibold`             | h1/h2 → `text-2xl`, h3 → `text-lg` |
| Body       | Roboto / Open Sans | `font-normal text-gray-700` | paragraphs, post descriptions      |
| Small Text | Same as body       | `text-sm text-gray-500`     | timestamps, comments, badges       |

## 3. Cards

* **Container:** `bg-white rounded-md p-4 shadow-sm hover:shadow-md transition duration-200 ease-in-out`
* **Spacing:** `space-y-2`
* **Hover:** `hover:bg-gray-50`
* **Badges:**

  * Status: `bg-green-100 text-green-600 px-2 py-0.5 text-xs rounded`
  * Labels: `bg-red-100 text-red-700 px-2 py-0.5 text-xs rounded`
* **Votes / Comments:** `text-sm text-gray-500`

## 4. Buttons

| Type                | Tailwind Classes                                                           | Notes               |
| ------------------- | -------------------------------------------------------------------------- | ------------------- |
| Primary             | `bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition`    | Main actions        |
| Secondary           | `bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition` | Secondary actions   |
| Disabled            | `opacity-50 cursor-not-allowed`                                            | Login restrictions  |
| Inline Icon Buttons | `p-2 rounded hover:bg-gray-100 transition`                                 | Votes, edit, delete |

## 5. Forms

* **Input / Textarea / Select:** `w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-accent focus:border-accent transition`
* **Form container:** `bg-white p-4 rounded-md shadow-sm space-y-4`
* **Error messages:** `text-sm text-red-600`
* **Spacing:** `space-y-2`

## 6. Navbar

* **Container:** `bg-primary text-white p-4 flex justify-between items-center`
* **Links:** `hover:text-accent transition`
* **Active link:** `underline font-semibold`
* **Dropdowns:** `bg-white text-gray-700 rounded shadow-md p-2 space-y-2`

## 7. Chat Page

* **Container:** `bg-background p-4 rounded-md flex flex-col h-full`
* **Message bubbles:**

  * Self: `bg-primary text-white rounded-xl p-3 max-w-[70%] self-end`
  * Others: `bg-white text-gray-800 rounded-xl p-3 max-w-[70%] self-start shadow-sm`
* **Timestamp:** `text-xs text-gray-400`
* **Input:** `w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-accent`

## 8. Animations & Transitions

* Cards: `hover:shadow-md hover:bg-gray-50 transition duration-200 ease-in-out`
* Buttons: `hover:scale-105 active:scale-95 transition-transform`
* Form error: `animate-pulse`
* Optional page load: `opacity-0 animate-fadeIn`

## 9. Icons

* **Library:** lucide-react
* **Examples:** ThumbsUp, ThumbsDown, MessageCircle, Calendar, MapPin, BookOpen, HelpCircle
* **Tooltips:** Use `Tooltip` for clarity

## 10. Layout & Spacing

* Max width: `max-w-4xl mx-auto`
* Padding: `p-4` → `p-6`
* Section spacing: `space-y-6`
* Grid for forms & cards on large screens:

```jsx
<div className="md:grid md:grid-cols-3 gap-6">
  <div className="md:col-span-2">Cards list</div>
  <div>Form</div>
</div>
```

* Section separators: `border-t border-gray-200 pt-6`

## 11. Suggested Fonts from Google

* Headings: `Poppins` weight 600
* Body: `Roboto` weight 400
* Optional monospace: `Fira Code`

## 12. Misc Tips

* Card hover: `hover:translate-y-1`
* Highlight user’s vote: `text-green-600`
* Badges: rounded corners, small padding
* Chat scroll: `overflow-y-auto` with padding
