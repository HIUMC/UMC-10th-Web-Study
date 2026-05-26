import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface SignupInputProps<T extends FieldValues> {
  name:Path<T>;
  type:string;
  placeholder:string;
  register:UseFormRegister<T>;
  error?:string;
}

export default function SignupInputForm<T extends FieldValues>({name,type,placeholder,register,error}:SignupInputProps<T>){
  return (
    <>
      <input 
        {...register(name)}
        name={name}
        type={type} 
        className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
        ${error ? "border-red-500 bg-red-200":"border-gray-300"}`}
        placeholder={placeholder}
      />
      {error && <div className='text-red-500 text-sm'>{error}</div>}
    </>
  )
}
 
