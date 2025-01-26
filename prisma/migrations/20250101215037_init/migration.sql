-- CreateTable
CREATE TABLE "DefaultAssistant" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DefaultAssistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultSection" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultValue" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DefaultSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Duty" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "restDayCount" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Duty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DutyMonthConfig" (
    "dutyId" UUID NOT NULL,
    "selectedDate" TIMESTAMP(3) NOT NULL,
    "datesInMonth" INTEGER NOT NULL,
    "weekendIndexes" INTEGER[]
);

-- CreateTable
CREATE TABLE "DutyAssistant" (
    "id" UUID NOT NULL,
    "dutyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "disabledDays" INTEGER[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DutyAssistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DutySection" (
    "id" UUID NOT NULL,
    "dutyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DutySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedDay" (
    "dutyId" UUID NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "assistantId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,

    CONSTRAINT "SelectedDay_pkey" PRIMARY KEY ("dutyId","assistantId","dayIndex")
);

-- CreateTable
CREATE TABLE "DisabledDays" (
    "dutyId" UUID NOT NULL,
    "assistantId" UUID NOT NULL,
    "dayIndex" INTEGER[],

    CONSTRAINT "DisabledDays_pkey" PRIMARY KEY ("dutyId","assistantId")
);

-- CreateTable
CREATE TABLE "UnwantedDay" (
    "dutyId" UUID NOT NULL,
    "assistantId" UUID NOT NULL,
    "dayIndex" INTEGER[],

    CONSTRAINT "UnwantedDay_pkey" PRIMARY KEY ("dutyId","assistantId")
);

-- CreateTable
CREATE TABLE "AssistantSectionConfig" (
    "dutyId" UUID NOT NULL,
    "assistantId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "totalLimit" INTEGER NOT NULL,

    CONSTRAINT "AssistantSectionConfig_pkey" PRIMARY KEY ("dutyId","assistantId","sectionId")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DutyMonthConfig_dutyId_key" ON "DutyMonthConfig"("dutyId");

-- CreateIndex
CREATE UNIQUE INDEX "UnwantedDay_assistantId_key" ON "UnwantedDay"("assistantId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "DefaultAssistant" ADD CONSTRAINT "DefaultAssistant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultSection" ADD CONSTRAINT "DefaultSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Duty" ADD CONSTRAINT "Duty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DutyMonthConfig" ADD CONSTRAINT "DutyMonthConfig_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DutyAssistant" ADD CONSTRAINT "DutyAssistant_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DutySection" ADD CONSTRAINT "DutySection_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedDay" ADD CONSTRAINT "SelectedDay_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "DutyAssistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedDay" ADD CONSTRAINT "SelectedDay_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedDay" ADD CONSTRAINT "SelectedDay_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "DutySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledDays" ADD CONSTRAINT "DisabledDays_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "DutyAssistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledDays" ADD CONSTRAINT "DisabledDays_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnwantedDay" ADD CONSTRAINT "UnwantedDay_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "DutyAssistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnwantedDay" ADD CONSTRAINT "UnwantedDay_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantSectionConfig" ADD CONSTRAINT "AssistantSectionConfig_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "DutyAssistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantSectionConfig" ADD CONSTRAINT "AssistantSectionConfig_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantSectionConfig" ADD CONSTRAINT "AssistantSectionConfig_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "DutySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
