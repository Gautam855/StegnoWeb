"use client";
import Image from "next/image";
import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "../../../components/ui/3d-card";
import { BackgroundBeams } from "../../../components/ui/background-beams";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/input";
import {NavbarDemo} from "../nav";
import Swal from 'sweetalert2';
import { cn } from "../../../utils/cn";

const EncryptText = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textData, setTextData] = useState<string>("");

  const handleHideClick = async () => {
    let password="";
    if (selectedImage == null) {
      Swal.fire({
        title: 'Error!',
        text: 'Please First Select Image',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    } else {


      const { value: password } = await Swal.fire({
        title: "Enter your password",
        input: "password",
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        inputAttributes: {
          maxlength: "10",
          autocapitalize: "off",
          autocorrect: "off"
        }
      });
      if (!password) {
        Swal.fire({
          title: 'Error!',
          text: 'Password is required',
          icon: 'error',
          confirmButtonText: 'Cool'
        });
        return;
      }

      const formData = new FormData();
      formData.append("image", dataURLtoFile(selectedImage, "image.png"));
      formData.append("text", textData);
      formData.append("password",password);

      const process_request = await fetch("http://localhost:5000/encrypt_text", {
        method: "POST",
        body: formData,
      });

      if (process_request.ok) {
        const blob = await process_request.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "encrypted_image.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        Swal.fire({
          title: 'Success!',
          text: 'Data Encrypted and Image Download Successfully',
          icon: 'success',
          confirmButtonText: 'Cool'
        })
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Faild to Encrypted or may be something else',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="mb-40 overflow-hidden"><NavbarDemo /> 
      <div className="text-center mt-32 text-6xl text-sky-400">Encrypt Text</div>
      <div className="flex flex-row items-center justify-around">
        <ThreeDCardDemo handleImageChange={handleImageChange} selectedImage={selectedImage} />
        <SignupFormDemo setTextData={setTextData} handleHideClick={handleHideClick} />
      </div>
      <BackgroundBeams />
    </div>
  );
};

interface SignupFormDemoProps {
  setTextData: (value: string) => void;
  handleHideClick: () => void;
}

const SignupFormDemo = ({ setTextData, handleHideClick }: SignupFormDemoProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleHideClick();
  };

  return (
    <CardContainer className="inter-var">
    <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
  
    <form className="flex flex-col items-center justify-around" onSubmit={handleSubmit}>
    <CardItem translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"> 
      <LabelInputContainer>
        <Label htmlFor="message">
          <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
          Your Message
        </CardItem></Label>
        <Textarea
          id="message"
          placeholder="Please Enter Your Secret Message here"
          onChange={(e) => setTextData(e.target.value)}
        />
      </LabelInputContainer>
      </CardItem>

    
    
        <button type="submit"  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Hide Data
          </span>
        </button>

        
     
      
    </form>
    </CardBody>
    </CardContainer>
  );
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("mb-8 space-y-2 w-128", className)}>{children}</div>;
};

interface ThreeDCardDemoProps {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: string | null;
}

const ThreeDCardDemo = ({ handleImageChange, selectedImage }: ThreeDCardDemoProps) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
        <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
          Select Image
        </CardItem>
        <CardItem translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Please select the image for Decryption
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          {selectedImage ? (
            <Image
              src={selectedImage}
              height="800"
              width="1000"
              className="h-full mt-8 mb-8 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          ) : (
            <div className="h-60 w-full flex items-center justify-center text-gray-400">No image selected</div>
          )}
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem translateZ={20} className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white">
            Try now →
          </CardItem>
          <label htmlFor="imageUpload" className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px]">
            <input type="file" id="imageUpload" className="absolute inset-0 opacity-0" onChange={handleImageChange} />
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">Browse Image</span>
          </label>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default EncryptText;
