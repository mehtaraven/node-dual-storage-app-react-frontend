// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
// A simple lookup table: given a "type" string from the JSON,
// return the React component that knows how to render it.
//
// Think of it like a menu at a restaurant:
//   "input"    → here's the input dish
//   "textarea" → here's the textarea dish
//   "checkbox" → here's the checkbox dish
//
// WHY this exists:
//   The rendering engine (FormBuilder.jsx) does NOT import individual components.
//   It only knows about THIS registry. This means:
//   - Adding a new type = 1 new file + 1 line here
//   - The engine never changes
//   - Each component is independent
//
// HOW TO ADD A NEW TYPE (e.g., "radio"):
//   1. Create DynamicRadio.jsx
//   2. Import it here
//   3. Add: radio: DynamicRadio
//   4. Done. Engine renders it automatically.
// ─────────────────────────────────────────────────────────────────────────────

import DynamicInput from './DynamicInput';
import DynamicTextarea from './DynamicTextarea';
import DynamicCheckbox from './DynamicCheckbox';
import DynamicSelect from './DynamicSelect';
import DynamicButton from './DynamicButton';

const ComponentRegistry = {
    input: DynamicInput,
    textarea: DynamicTextarea,
    checkbox: DynamicCheckbox,
    select: DynamicSelect,
    button: DynamicButton
};

export default ComponentRegistry;