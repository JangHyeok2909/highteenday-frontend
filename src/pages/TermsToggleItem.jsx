import React from 'react';

export default function TermsToggleItem({ id, label, checked, onChange }) {
    return (
        <li>
            <label>
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(id, e.target.checked)}
                />
                {label}
            </label>
        </li>
    );
}