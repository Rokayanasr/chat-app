import React, { useRef, useState } from "react";
import { useSendMessageMutation } from "../Redux/Services/messages/messagesApi";
import { Image, Loader, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
function MessageInput() {
    const { selectedUser } = useSelector((state) => state.messages);
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [sendMessage, { isLoading }] = useSendMessageMutation();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            sendMessage({
                id: selectedUser._id,
                message: {
                    text,
                    image: imagePreview,
                },
            })
                .unwrap()
                .then(() => {
                    setText("");
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                })
                .catch((error) => {
                    console.error("Failed to send message", error);
                    toast.error("Failed to send message. Please try again.");
                });
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

    return (
        <div className='p-4 w-full'>
            {imagePreview && (
                <div className='mb-3 flex items-center gap-2'>
                    <div className='relative'>
                        <img src={imagePreview} alt='Preview' className='w-20 h-20 object-cover rounded-lg border border-zinc-700' />
                        <button
                            onClick={removeImage}
                            className='absolute cursor-pointer -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center'
                            type='button'>
                            <X className='size-3' />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
                <div className='flex-1 flex gap-2'>
                    <input
                        type='text'
                        placeholder='Type a message...'
                        className='w-full input input-bordered rounded-lg input-sm sm:input-md'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        type='button'
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}>
                        <Image size={20} />
                        <input type='file' accept='image/*' className='hidden' ref={fileInputRef} onChange={handleImageChange} />
                    </button>
                </div>
                <button type='submit' className='btn btn-primary btn-sm sm:btn-md'>
                    {isLoading ? <Loader className='animate-spin' size={22} /> : <Send size={22} />}
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
