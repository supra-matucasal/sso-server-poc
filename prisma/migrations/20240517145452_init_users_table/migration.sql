-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "referee_user_id" INTEGER,
    "auth0_id" TEXT,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "country" TEXT,
    "phone_number" TEXT,
    "referral_url" TEXT,
    "kyc_status" TEXT,
    "type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "onfido_application_meta" JSONB,
    "onfido_applicant_id" TEXT,
    "hubspot_id" TEXT,
    "onfido_poa_properties" JSONB,
    "onfido_document_properties" JSONB,
    "onfido_applicant_fraud_properties" JSONB,
    "username" TEXT,
    "is_phone_notifications_enabled" BOOLEAN DEFAULT false,
    "onfido_poa_result" TEXT,
    "onfido_poa_status" TEXT,
    "onfido_document_result" TEXT,
    "onfido_document_status" TEXT,
    "onfido_applicant_fraud_result" TEXT,
    "onfido_applicant_fraud_status" TEXT,
    "is_gpc_enabled" BOOLEAN DEFAULT false,
    "telegram_handle" TEXT,
    "ref" TEXT,
    "ref_code" TEXT,
    "eligible_for_tokens" BOOLEAN DEFAULT false,
    "email_verification_code" TEXT,
    "email_verified_at" TIMESTAMP(3),
    "is_onfido_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "onfido_known_faces_result" TEXT,
    "onfido_known_faces_properties" JSONB,
    "onfido_known_faces_status" TEXT,
    "onfido_reviewed_at" TIMESTAMP(3),
    "is_banned" BOOLEAN DEFAULT false,
    "banned_reason" TEXT,
    "deleted_at" TIMESTAMP(3),
    "onfido_workflow_run_id" TEXT,
    "manual_review" BOOLEAN NOT NULL DEFAULT false,
    "twitter_account" TEXT,
    "discord_account" TEXT,
    "discord_id" TEXT,
    "twitter_id" TEXT,
    "wallet_address" TEXT,
    "staking_preference" JSONB,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "user_auth0_id_index" ON "User"("auth0_id");

-- CreateIndex
CREATE INDEX "users_deleted_at_index" ON "User"("deleted_at");

-- CreateIndex
CREATE INDEX "users_is_banned_index" ON "User"("is_banned");

-- CreateIndex
CREATE INDEX "users_kyc_status_completed_index" ON "User"("kyc_status");

-- CreateIndex
CREATE INDEX "users_onfido_applicant_id_index" ON "User"("onfido_applicant_id");

-- CreateIndex
CREATE INDEX "users_onfido_workflow_run_id_index" ON "User"("onfido_workflow_run_id");

-- CreateIndex
CREATE INDEX "users_referee_user_id_index" ON "User"("referee_user_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referee_user_id_fkey" FOREIGN KEY ("referee_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
