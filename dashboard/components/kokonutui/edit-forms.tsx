"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Trash2, PlusCircle } from "lucide-react"

// --- Schemas for Form Validation ---

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  about_text: z.string().min(1, "About text is required"),
  dashboard_intro_text: z.string().min(1, "Dashboard intro is required"),
  profile_picture_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  resume_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  credly_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  youtube_video_id: z.string().optional(),
  education_data: z.object({
      university: z.string().min(1, "University is required"),
      degree: z.string().min(1, "Degree is required"),
      period: z.string().min(1, "Period is required"),
      activities: z.array(z.string()).optional(),
  }),
})

const experienceSchema = z.object({
  id: z.number().optional(),
  role: z.string().min(1, "Role is required"),
  period: z.string().min(1, "Period is required"),
  duties: z.string().min(1, "Duties are required"), // Handled as a single string in textarea
})

const certificationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
})

const skillsArraySchema = z.object({
  skills: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, "Skill name cannot be empty."),
      type: z.string().min(1, "Skill type cannot be empty."),
      is_key_skill: z.boolean(),
    })
  ),
});

const projectSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    technologies: z.string().min(1, "Technologies are required"), // Handled as string
    gallery_urls: z.string().optional(), // Handled as string
    summary: z.string().optional(),
    github_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    category: z.string().min(1, "Category is required"),
    is_featured: z.boolean().default(false),
});

const hobbiesSchema = z.object({
    side_quests: z.array(z.object({
        description: z.string().min(1, "Description is required"),
        image_urls: z.array(z.string().url("Must be a valid URL")),
    }))
});


// --- Reusable Form Components ---

const FormSection = ({ title, description, children }) => (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const FormFieldRenderer = ({ control, name, label, type, placeholder, rows }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                if (type === 'checkbox') {
                    return (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>{label}</FormLabel>
                            </div>
                        </FormItem>
                    );
                }
                const value = Array.isArray(field.value) ? field.value.join(name === 'technologies' || name === 'gallery_urls' ? ', ' : '\n') : field.value;
                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            {type === 'textarea'
                                ? <Textarea {...field} value={value || ''} placeholder={placeholder} rows={rows || 3} />
                                : <Input {...field} value={value || ''} placeholder={placeholder} />
                            }
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};


const SingleItemForm = ({ schema, initialData, tableName, refreshData, formFields, title = "Item" }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData || formFields.reduce((acc, field) => ({ ...acc, [field.name]: field.type === 'checkbox' ? false : '' }), {}),
    });

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (values.duties && typeof values.duties === 'string') {
                values.duties = values.duties.split('\n').filter(d => d.trim() !== '');
            }
            if (values.technologies && typeof values.technologies === 'string') {
                values.technologies = values.technologies.split(',').map(t => t.trim()).filter(Boolean);
            }
             if (values.gallery_urls && typeof values.gallery_urls === 'string') {
                values.gallery_urls = values.gallery_urls.split(',').map(t => t.trim()).filter(Boolean);
            }

            const { id, ...updateData } = values;
            const { error } = id
                ? await supabase.from(tableName).update(updateData).eq('id', id)
                : await supabase.from(tableName).insert(updateData);

            if (error) throw error;
            toast.success(`${title} ${id ? 'updated' : 'added'} successfully!`);
            refreshData();
            if (!id) form.reset();
        } catch (error) {
            const { id } = form.getValues();
            toast.error(`Failed to ${id ? 'update' : 'add'} ${title.toLowerCase()}: ${error.message}`);
        }
        setIsSubmitting(false);
    };
    
    const handleDelete = async () => {
        if (!initialData?.id) return;
        if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from(tableName).delete().eq('id', initialData.id);
            if (error) throw error;
            toast.success(`${title} deleted successfully!`);
            refreshData();
        } catch (error) {
            toast.error(`Failed to delete ${title.toLowerCase()}: ${error.message}`);
        }
        setIsSubmitting(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-b pb-4 mb-4">
                {formFields.map(field => <FormFieldRenderer key={field.name} control={form.control} {...field} />)}
                <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData?.id ? "Save Changes" : `Add ${title}`}
                    </Button>
                    {initialData?.id && (
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}

const experienceFields = [
    { name: 'role', label: 'Role' },
    { name: 'period', label: 'Period (e.g., June 2025 - Current)' },
    { name: 'duties', label: 'Duties (one per line)', type: 'textarea' },
];

const certificationFields = [
    { name: 'name', label: 'Certification Name' },
    { name: 'issuer', label: 'Issuer (e.g., CompTIA)' },
    { name: 'image_url', label: 'Image URL' },
];

const projectFields = [
    { name: 'title', label: 'Project Title' },
    { name: 'category', label: 'Category' },
    { name: 'description', label: 'Short Description (use newlines for paragraphs)', type: 'textarea', rows: 5 },
    { name: 'summary', label: 'Summary / Case File Details', type: 'textarea' },
    { name: 'technologies', label: 'Technologies (comma-separated)', type: 'textarea' },
    { name: 'gallery_urls', label: 'Image Gallery URLs (comma-separated)', type: 'textarea' },
    { name: 'github_url', label: 'GitHub URL' },
    { name: 'is_featured', label: 'Featured Project', type: 'checkbox' }
];

export const ProfileForm = ({ initialData, refreshData }) => {
    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            ...initialData,
            education_data: initialData?.education_data || { university: '', degree: '', period: '', activities: [] },
        },
    });

    const onSubmit = async (values) => {
        try {
            const { error } = await supabase
                .from("portfolio_content")
                .update(values)
                .eq("id", initialData.id);

            if (error) throw error;
            toast.success("Profile updated successfully!");
            refreshData();
        } catch (error) {
            toast.error("Failed to update profile: " + error.message);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="role" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="about_text" render={({ field }) => (
                    <FormItem>
                        <FormLabel>About Text</FormLabel>
                        <FormControl><Textarea {...field} rows={5} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField name="dashboard_intro_text" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dashboard Intro</FormLabel>
                        <FormControl><Textarea {...field} rows={3} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="profile_picture_url" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Profile Picture URL</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField name="resume_url" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Resume URL</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField name="credly_url" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Credly URL</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField name="youtube_video_id" render={({ field }) => (
                    <FormItem>
                        <FormLabel>YouTube Video ID</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <h3 className="text-lg font-medium pt-4">Education</h3>
                <FormField name="education_data.university" render={({ field }) => (
                    <FormItem>
                        <FormLabel>University</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField name="education_data.degree" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField name="education_data.period" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Period</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </form>
        </Form>
    );
};

export const ExperienceForm = ({ initialData, refreshData }) => (
    <FormSection title="Manage Experience">
        {initialData.map(item => <SingleItemForm key={item.id} schema={experienceSchema} initialData={item} tableName="experience" refreshData={refreshData} formFields={experienceFields} title="Experience" />)}
        <h3 className="font-bold mt-8 mb-4">Add New Experience</h3>
        <SingleItemForm schema={experienceSchema} tableName="experience" refreshData={refreshData} formFields={experienceFields} title="Experience" />
    </FormSection>
);

export const CertificationsForm = ({ initialData, refreshData }) => (
    <FormSection title="Manage Certifications">
        {initialData.map(item => <SingleItemForm key={item.id} schema={certificationSchema} initialData={item} tableName="certifications" refreshData={refreshData} formFields={certificationFields} title="Certification" />)}
        <h3 className="font-bold mt-8 mb-4">Add New Certification</h3>
        <SingleItemForm schema={certificationSchema} tableName="certifications" refreshData={refreshData} formFields={certificationFields} title="Certification" />
    </FormSection>
);

export const SkillsForm = ({ initialData, refreshData }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const form = useForm({
        resolver: zodResolver(skillsArraySchema),
        defaultValues: { skills: initialData || [] },
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "skills",
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const { skills } = data;

        const upserts = skills.map(({ id, ...skillData }) => ({
            ...skillData,
            ...(id ? { id } : {}),
        }));

        const originalIds = initialData.map(s => s.id);
        const currentIds = skills.map(s => s.id).filter(Boolean);
        const idsToDelete = originalIds.filter(id => !currentIds.includes(id));

        try {
            if (upserts.length > 0) {
                const { error: upsertError } = await supabase.from('skills').upsert(upserts);
                if (upsertError) throw upsertError;
            }
            
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await supabase.from('skills').delete().in('id', idsToDelete);
                if (deleteError) throw deleteError;
            }

            toast.success("Skills updated successfully!");
            refreshData();
        } catch (error) {
            toast.error("Failed to update skills: " + error.message);
        }
        setIsSubmitting(false);
    };

    return (
        <FormSection title="Manage Skills">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-4 items-end p-4 border rounded-md">
                            <FormFieldRenderer control={form.control} name={`skills.${index}.name`} label="Skill Name" />
                            <FormFieldRenderer control={form.control} name={`skills.${index}.type`} label="Type" />
                            <FormFieldRenderer control={form.control} name={`skills.${index}.is_key_skill`} label="Key Skill" type="checkbox" />
                            <Button type="button" variant="destructive" onClick={() => remove(index)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    ))}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ name: '', type: '', is_key_skill: false })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Save All Skills
                        </Button>
                    </div>
                </form>
            </Form>
        </FormSection>
    )
}

export const ProjectsForm = ({ initialData, refreshData }) => (
    <FormSection title="Manage Projects">
        {initialData.map(item => <SingleItemForm key={item.id} schema={projectSchema} initialData={item} tableName="projects" refreshData={refreshData} formFields={projectFields} title="Project" />)}
        <h3 className="font-bold mt-8 mb-4">Add New Project</h3>
        <SingleItemForm schema={projectSchema} tableName="projects" refreshData={refreshData} formFields={projectFields} title="Project" />
    </FormSection>
);

export const HobbiesForm = ({ initialData, refreshData }) => {
    const form = useForm({
        resolver: zodResolver(hobbiesSchema),
        defaultValues: { side_quests: initialData?.side_quests || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "side_quests",
    });

    const onSubmit = async (values) => {
        try {
            const { error } = await supabase
                .from("portfolio_content")
                .update({ side_quests: values.side_quests })
                .eq("id", initialData.id);

            if (error) throw error;
            toast.success("Hobbies updated successfully!");
            refreshData();
        } catch (error) {
            toast.error("Failed to update hobbies: " + error.message);
        }
    };

    return (
        <FormSection title="Manage Hobbies">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                            <FormField
                                control={form.control}
                                name={`side_quests.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`side_quests.${index}.image_urls`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URLs (comma-separated)</FormLabel>
                                        <FormControl><Input {...field} onChange={e => field.onChange(e.target.value.split(',').map(url => url.trim()))} value={Array.isArray(field.value) ? field.value.join(', ') : ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Remove Hobby
                            </Button>
                        </div>
                    ))}
                     <Button type="button" variant="outline" onClick={() => append({ description: '', image_urls: [] })}>
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Hobby
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Hobbies
                    </Button>
                </form>
            </Form>
        </FormSection>
    )
}