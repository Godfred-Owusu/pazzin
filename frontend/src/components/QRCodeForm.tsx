// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2, Zap } from "lucide-react";
// import { UserFormData, Program } from "./QRCodeGenerator";

// interface QRCodeFormProps {
//   onSubmit: (data: UserFormData) => Promise<void>;
//   isLoading: boolean;
//   disabled?: boolean;
//   programs: Program[];
//   programsLoading: boolean;
// }

// export const QRCodeForm = ({
//   onSubmit,
//   isLoading,
//   disabled,
// }: // programs,
// // programsLoading,
// QRCodeFormProps) => {
//   const [formData, setFormData] = useState<UserFormData>({
//     name: "",
//     email: "",
//     phone: "",
//     // programId: "",
//   });
//   const [errors, setErrors] = useState<Partial<UserFormData>>({});

//   const validateForm = (): boolean => {
//     const newErrors: Partial<UserFormData> = {};

//     // Name validation
//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     } else if (formData.name.trim().length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     // Phone validation
//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (formData.phone.trim().length < 10) {
//       newErrors.phone = "Please enter a valid phone number";
//     }

//     // Program validation
//     // if (!formData.programId.trim()) {
//     //   newErrors.programId = "Program is required";
//     // }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     await onSubmit(formData);
//   };

//   const handleInputChange = (field: keyof UserFormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: undefined }));
//     }
//   };

//   const handleSelectChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, programId: value }));

//     // Clear error when user selects a program
//     // if (errors.programId) {
//     //   setErrors((prev) => ({ ...prev, programId: undefined }));
//     // }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-2">
//         <Label htmlFor="name" className="text-sm font-medium text-foreground">
//           Full Name
//         </Label>
//         <Input
//           id="name"
//           type="text"
//           placeholder="Enter your full name"
//           value={formData.name}
//           onChange={(e) => handleInputChange("name", e.target.value)}
//           disabled={disabled || isLoading}
//           className={`transition-all duration-200 ${
//             errors.name
//               ? "border-destructive focus:ring-destructive"
//               : "border-border hover:border-primary/50 focus:border-primary"
//           }`}
//         />
//         {errors.name && (
//           <p className="text-sm text-destructive animate-fade-in">
//             {errors.name}
//           </p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email" className="text-sm font-medium text-foreground">
//           Email Address
//         </Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="Enter your email address"
//           value={formData.email}
//           onChange={(e) => handleInputChange("email", e.target.value)}
//           disabled={disabled || isLoading}
//           className={`transition-all duration-200 ${
//             errors.email
//               ? "border-destructive focus:ring-destructive"
//               : "border-border hover:border-primary/50 focus:border-primary"
//           }`}
//         />
//         {errors.email && (
//           <p className="text-sm text-destructive animate-fade-in">
//             {errors.email}
//           </p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="phone" className="text-sm font-medium text-foreground">
//           Phone Number
//         </Label>
//         <Input
//           id="phone"
//           type="tel"
//           placeholder="Enter your phone number"
//           value={formData.phone}
//           onChange={(e) => handleInputChange("phone", e.target.value)}
//           disabled={disabled || isLoading}
//           className={`transition-all duration-200 ${
//             errors.phone
//               ? "border-destructive focus:ring-destructive"
//               : "border-border hover:border-primary/50 focus:border-primary"
//           }`}
//         />
//         {errors.phone && (
//           <p className="text-sm text-destructive animate-fade-in">
//             {errors.phone}
//           </p>
//         )}
//       </div>

//       {/* <div className="space-y-2">
//         <Label
//           htmlFor="program"
//           className="text-sm font-medium text-foreground"
//         >
//           Program
//         </Label>
//         <Select
//           value={formData.programId}
//           onValueChange={handleSelectChange}
//           disabled={disabled || isLoading || programsLoading}
//         >
//           <SelectTrigger
//             className={`transition-all duration-200 ${
//               errors.programId
//                 ? "border-destructive focus:ring-destructive"
//                 : "border-border hover:border-primary/50 focus:border-primary"
//             }`}
//           >
//             <SelectValue
//               placeholder={
//                 programsLoading ? "Loading programs..." : "Select your program"
//               }
//             />
//           </SelectTrigger>
//           <SelectContent className="bg-background border border-border shadow-lg z-50">
//             {programs.map((program) => (
//               <SelectItem
//                 key={program._id}
//                 value={program._id}
//                 className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
//               >
//                 {program.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.programId && (
//           <p className="text-sm text-destructive animate-fade-in">
//             {errors.programId}
//           </p>
//         )}
//       </div> */}

//       <Button
//         type="submit"
//         disabled={disabled || isLoading}
//         className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] shadow-qr"
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Registering...
//           </>
//         ) : (
//           <>
//             <Zap className="mr-2 h-4 w-4" />
//             Register
//           </>
//         )}
//       </Button>
//     </form>
//   );
// };

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Zap } from "lucide-react";
import { UserFormData } from "./QRCodeGenerator";

interface QRCodeFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export const QRCodeForm = ({
  onSubmit,
  isLoading,
  disabled,
}: QRCodeFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={disabled || isLoading}
          className={`transition-all duration-200 ${
            errors.name
              ? "border-destructive focus:ring-destructive"
              : "border-border hover:border-primary/50 focus:border-primary"
          }`}
        />
        {errors.name && (
          <p className="text-sm text-destructive animate-fade-in">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={disabled || isLoading}
          className={`transition-all duration-200 ${
            errors.email
              ? "border-destructive focus:ring-destructive"
              : "border-border hover:border-primary/50 focus:border-primary"
          }`}
        />
        {errors.email && (
          <p className="text-sm text-destructive animate-fade-in">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={disabled || isLoading}
          className={`transition-all duration-200 ${
            errors.phone
              ? "border-destructive focus:ring-destructive"
              : "border-border hover:border-primary/50 focus:border-primary"
          }`}
        />
        {errors.phone && (
          <p className="text-sm text-destructive animate-fade-in">
            {errors.phone}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={disabled || isLoading}
        className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] shadow-qr"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Register
          </>
        )}
      </Button>
    </form>
  );
};
