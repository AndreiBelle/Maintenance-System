const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET_NAME = "equipments";

async function uploadEquipmentImage(file) {
    if (!file || file.size === 0) {
        return null;
    }

    // const typeUpload = file.originalname.split(".").pop()?.toLowerCase();
    // const ext = typeUpload && typeUpload.length <= 5 ? typeUpload : "jpg";

    const fileName = `equipment-${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        throw new Error(`Falha ao enviar imagem para o Storage: ${error.message}`);
    }

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    return data.publicUrl;
}

module.exports = { uploadEquipmentImage };