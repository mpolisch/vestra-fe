import { inputClassName } from '@/lib/styles';

interface CurrencyInputProps {
    id: string;
    placeholder?: string;
    registration: object; // from react-hook-form's register()
}

export function CurrencyInput({ id, placeholder, registration }: CurrencyInputProps) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted pointer-events-none">
                $
            </span>
            <input
                {...registration}
                id={id}
                type="number"
                placeholder={placeholder}
                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                className={`${inputClassName} pl-7`}
            />
        </div>
    );
}
