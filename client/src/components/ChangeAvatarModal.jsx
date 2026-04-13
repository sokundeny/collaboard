import { useEffect, useState } from "react";
import Modal from "./Modal";
import { uploadProfileAvatar } from "../services/api";

const ChangeAvatarModal = ({ active, onClose }) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!active) {
            setSelectedFile(null)
            setPreview(null)
        }
    }, [active])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setIsUploading(true)

        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("upload_preset", "avatar_upload")
        formData.append("folder", "avatars")

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/dsdgi7f7f/image/upload`, {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            console.log("Data", data)

            if (!res.ok) {
                console.error("Cloudinary error:", data);
                throw new Error(data?.error?.message || "Upload failed");
            }
            
            const { public_id, secure_url } = data

            try {
                const response = await uploadProfileAvatar(public_id, secure_url)
                console.log(response)
            } catch (err) {
                console.error(err);
                
            }

            onClose()
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false)
        }
    }

    return(
        <Modal active={active}>
            
            <h2 className="text-2xl font-bold text-brand-yellow">Change Avatar</h2>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-white/80"
            />

            {preview && (
                <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full object-cover mt-4"
                />
            )}

            <div className="flex justify-end gap-3 mt-4">
                <button
                    disabled={!selectedFile || isUploading}
                    onClick={handleUpload}
                    className={`px-4 py-2 text-sm font-medium rounded 
                                ${!selectedFile || isUploading ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-brand-yellow hover:bg-brand-yellow-hover text-black'}`}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
                
                <button
                    onClick={() => onClose()}
                    className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    )
}

export default ChangeAvatarModal