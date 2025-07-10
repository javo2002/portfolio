"use client"

import {
    Home,
    PanelLeft,
    GraduationCap,
    User,
    Menu,
    Moon,
    Sun,
    Laptop,
    Github,
    Linkedin,
    Mail,
    Lock,
    Edit,
    Loader2,
    Save,
    Link as LinkIcon,
    Download,
    FileCode, // Project Icon
    ScanSearch, // Skills Icon
    FileUser, // About Icon
    Archive, // Experience Icon
    Award, // Certifications Icon
    Coffee, // Hobbies Icon
    Info, // Inspector Icon
    Database,
    Server,
    ShieldCheck,
    TerminalSquare,
    Users,
    Cpu,
    AlertTriangle, // For error messages
    MapPin,
    CheckCircle,
    Terminal, // Terminal Icon
    Youtube, // YouTube Icon
    Upload,
    Trash2,
    PlusCircle,
    XCircle,
    LogOut
} from "lucide-react"
import * as React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
    ProfileForm,
    ExperienceForm,
    CertificationsForm,
    SkillsForm,
    ProjectsForm,
    HobbiesForm
} from "@/components/kokonutui/edit-forms";


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeProvider, useTheme } from "next-themes"
import { supabase } from "../../lib/supabaseClient"
import { toast } from "sonner"


// --- Components (Moved to top-level) ---

const About = ({ data, setInspectedItem }) => (
    <Card className="animate-glitch-in" onMouseEnter={() => setInspectedItem({ title: 'About', details: 'A formal specification describing my professional background, design philosophy, and technical approach.' })}>
        <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Professional Statement</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="whitespace-pre-wrap leading-relaxed font-mono">{data?.about_text || "Accessing profile data..."}</p>
        </CardContent>
    </Card>
)

const Education = ({ data, setInspectedItem }) => (
    <Card className="animate-glitch-in" onMouseEnter={() => setInspectedItem({ title: 'Education', details: 'Chronological record of institutional training and academic credentials.' })}>
        <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Academic Record</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-sans text-lg font-semibold text-secondary">{data?.education_data?.university}</h3>
                <p className="text-muted-foreground">{data?.education_data?.degree}</p>
                <p className="text-sm text-muted-foreground">{data?.education_data?.period}</p>
            </div>
            {data?.education_data?.activities && (
                <div>
                    <h4 className="font-sans font-semibold text-secondary">Extracurricular Activities</h4>
                    <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1">
                        {data.education_data.activities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                        ))}
                    </ul>
                </div>
            )}
        </CardContent>
    </Card>
)

const Experience = ({ data, setInspectedItem }) => (
    <Card className="animate-glitch-in" onMouseEnter={() => setInspectedItem({ title: 'Work Experience', details: 'Log of all known professional engagements and field operations.' })}>
        <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Professional History</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {(data || []).map(job => (
                <div
                    key={job.id}
                    className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-0.5 before:bg-border"
                    onMouseEnter={() => setInspectedItem({ title: job.role, details: `[${job.period}] - Analysis of operational duties.`})}
                >
                    <div className="absolute -left-2 top-2 h-4 w-4 rounded-none bg-primary border-2 border-background"></div>
                    <p className="text-sm text-muted-foreground">{job.period}</p>
                    <h3 className="font-sans text-lg font-semibold mt-1 text-secondary">{job.role}</h3>
                    <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1">
                        {(job.duties || []).map((duty, index) => <li key={index}>{duty}</li>)}
                    </ul>
                </div>
            ))}
        </CardContent>
    </Card>
);

const Certifications = ({ data, credlyUrl, setInspectedItem }) => {
    const certsByIssuer = (data || []).reduce((acc, cert) => {
        (acc[cert.issuer] = acc[cert.issuer] || []).push(cert);
        return acc;
    }, {});

    return (
        <Card className="animate-glitch-in" onMouseEnter={() => setInspectedItem({ title: 'Certifications', details: 'Verified skill specializations and commendations.' })}>
            <CardHeader>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Verified Credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {Object.entries(certsByIssuer).map(([issuer, certs]) => (
                    <div key={issuer}>
                        <h3 className="font-sans text-xl font-semibold mb-4 text-secondary">{issuer}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(certs || []).map((cert) => (
                                <div
                                    key={cert.id}
                                    className="border border-primary/20 p-3 flex items-center gap-4 hover:bg-primary/10"
                                    onMouseEnter={() => setInspectedItem({ title: cert.name, details: `Issuer: ${cert.issuer}. This credential validates skills in its respective domain.`, images: [cert.image_url] })}
                                >
                                    <Award className="h-8 w-8 text-primary flex-shrink-0"/>
                                    <p className="font-sans font-medium">{cert.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
            {credlyUrl && (
                <CardFooter>
                    <Button asChild variant="secondary">
                        <a href={credlyUrl} target="_blank" rel="noopener noreferrer">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify All on Credly
                        </a>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

const Hobbies = ({ data, setInspectedItem }) => (
     <Card className="animate-glitch-in" onMouseEnter={() => setInspectedItem({ title: 'Hobbies', details: 'Personal hobbies and interests outside of the technical domain.' })}>
        <CardHeader>
            <CardTitle>Hobbies</CardTitle>
            <CardDescription>Personal Interests</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {(data?.side_quests || []).map((quest, index) => (
                <div
                    key={index}
                    className="space-y-3 group cursor-pointer p-4 border border-transparent hover:border-primary/50 transition-colors"
                    onMouseEnter={() => setInspectedItem({ title: 'Log Entry', details: quest.description, images: quest.image_urls })}
                >
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{quest.description}</p>
                </div>
            ))}
        </CardContent>
    </Card>
);


const MaterialsSpecification = ({ skills, setInspectedItem }) => {
    const categorizedSkills = (skills || []).reduce((acc, skill) => {
        const category = skill.type || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {});

    return (
        <Card className="animate-glitch-in" onMouseEnter={() => setInspectedItem({ title: 'Skills', details: 'A matrix of known capabilities and technical proficiencies.' })}>
            <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Technical Specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.entries(categorizedSkills).map(([category, skillsInCategory]) => (
                    <div key={category}>
                        <h3 className="font-sans text-lg font-semibold mb-3 capitalize text-secondary">{category.replace('_', ' ')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {skillsInCategory.map(skill => (
                                <Badge
                                    key={skill.id}
                                    variant={skill.is_key_skill ? "default" : "outline"}
                                    className="text-base py-1 px-3"
                                    onMouseEnter={() => setInspectedItem({
                                        title: skill.name,
                                        details: `Classification: ${skill.type}${skill.is_key_skill ? ' (Key Skill)' : ''}`
                                    })}
                                >
                                    {skill.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const ProjectBlueprints = ({ projects, setInspectedItem, activeProject, setActiveProject }) => {
    const categorizedProjects = useMemo(() => {
        return (projects || []).reduce((acc, project) => {
            const category = project.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(project);
            return acc;
        }, {});
    }, [projects]);

    return (
        <Card className="animate-glitch-in" onMouseEnter={() => setInspectedItem({ title: 'Projects', details: 'A collection of case files detailing past operations.' })}>
            <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Case Files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {Object.entries(categorizedProjects).map(([category, projectsInCategory]) => (
                    <div key={category}>
                        <h3 className="text-2xl font-sans font-semibold mb-4 text-primary border-b border-primary/20 pb-2">{category}</h3>
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            value={activeProject ? activeProject.toString() : undefined}
                            onValueChange={(value) => setActiveProject(value ? parseInt(value, 10) : null)}
                        >
                            {projectsInCategory.map(project => (
                                <AccordionItem value={project.id.toString()} key={project.id}>
                                    <AccordionTrigger
                                        className="text-xl font-sans text-secondary"
                                        onMouseEnter={() => setInspectedItem({title: project.title, details: project.summary, images: project.gallery_urls})}
                                    >
                                        {project.title}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 pt-4">
                                            <div className="text-muted-foreground mb-4 space-y-3">
                                                {(project.description || "").split('\n').filter(p => p.trim() !== '').map((paragraph, i) => (
                                                    <p key={i}>{paragraph}</p>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <h4 className="font-sans w-full mb-1 text-primary">Technologies Used:</h4>
                                                {(project.technologies || []).map(tech => (
                                                    <Badge key={tech} variant="secondary">{tech}</Badge>
                                                ))}
                                            </div>
                                             {project.github_url && (
                                                <Button asChild variant="link" className="px-0 pt-4 text-primary">
                                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                                        <Github className="mr-2 h-4 w-4" />
                                                        View on GitHub
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const TerminalPage = ({ portfolioData, setInspectedItem }) => {
    const [history, setHistory] = useState<Array<{ command: string; output: React.ReactNode }>>([
        { command: 'help', output: <pre>{'Available commands:\n  help      - Show this list of commands\n  ls [-a]   - List files and directories\n  cd [dir]  - Change directory\n  cat [file]  - Display file content\n  clear     - Clear the terminal screen\n  sudo      - ???'}</pre> }
    ]);
    const [input, setInput] = useState('');
    const [currentPath, setCurrentPath] = useState('~');
    const inputRef = useRef(null);
    const endOfHistoryRef = useRef(null);

    const fileSystem = useMemo(() => {
        const fs = {
            '~': {
                type: 'dir',
                children: ['about.txt', 'skills.txt', 'experience.txt', 'projects', '.secrets']
            },
            '~/about.txt': { type: 'file', content: portfolioData?.content?.about_text || 'No about info.' },
            '~/skills.spec': { type: 'file', content: (portfolioData?.skills || []).map(s => `- ${s.name} (${s.type})`).join('\n') || 'No skills.' },
            '~/experience.log': { type: 'file', content: (portfolioData?.experience || []).map(e => `[${e.period}] ${e.role}\n${e.duties.map(d => `  - ${d}`).join('\n')}`).join('\n\n') || 'No experience.' },
            '~/projects': {
                type: 'dir',
                children: (portfolioData?.projects || []).map(p => p.title.replace(/\s+/g, '_') + '.case')
            },
            '~/.secrets': {
                type: 'dir',
                children: ['classified.txt']
            },
            '~/.secrets/classified.txt': { type: 'file', content: 'Access Granted. The architect\'s favorite coffee is a simple black Americano.' }
        };

        (portfolioData?.projects || []).forEach(p => {
            const fileName = p.title.replace(/\s+/g, '_') + '.case';
            fs[`~/projects/${fileName}`] = { type: 'file', content: `Title: ${p.title}\nCategory: ${p.category}\n\n${p.description}` };
        });
        return fs;
    }, [portfolioData]);

    const resolvePath = (path, current) => {
        if (!path) return current;
        if (path.startsWith('~')) {
            current = '~';
            path = path.substring(1);
        }
        const components = path.split('/').filter(Boolean);
        let resolved = current === '~' ? ['~'] : current.split('/');

        for (const component of components) {
            if (component === '..') {
                if (resolved.length > 1) resolved.pop();
            } else if (component !== '.') {
                resolved.push(component);
            }
        }
        return resolved.join('/') || '~';
    };

    const executeCommand = (commandStr) => {
        const [cmd, ...args] = commandStr.trim().split(' ');
        let output: React.ReactNode;

        switch (cmd) {
            case 'help': output = <pre>{'Available commands:\n  help      - Show this list of commands\n  ls [-a]   - List files and directories\n  cd [dir]  - Change directory\n  cat [file]  - Display file content\n  clear     - Clear the terminal screen\n  sudo      - ???'}</pre>; break;
            case 'sudo': output = <pre>{'User is not in the sudoers file. This incident will be reported.'}</pre>; break;
            case 'ls': {
                const showAll = args[0] === '-a';
                const dirContent = fileSystem[currentPath]?.children || [];
                const contentToDisplay = dirContent.filter(name => showAll || !name.startsWith('.'));

                output = (
                    <div className="flex flex-wrap gap-x-4">
                        {contentToDisplay.map(name => {
                            const fullPath = resolvePath(name, currentPath);
                            const isDir = fileSystem[fullPath]?.type === 'dir';
                            const colorClass = (showAll && isDir) ? 'text-red-500' : 'text-muted-foreground';
                            return <span key={name} className={colorClass}>{name}</span>;
                        })}
                    </div>
                );
                break;
            }
            case 'cd': {
                const targetDirRaw = args[0] || '~';
                const targetPath = resolvePath(targetDirRaw, currentPath);

                if (fileSystem[targetPath] && fileSystem[targetPath].type === 'dir') {
                    setCurrentPath(targetPath);
                    output = '';
                } else {
                    output = <pre>{`cd: no such file or directory: ${targetDirRaw}`}</pre>;
                }
                break;
            }
            case 'cat': {
                const targetFileRaw = args[0];
                if (!targetFileRaw) {
                    output = <pre>{'cat: missing operand'}</pre>;
                    break;
                }
                const targetFilePath = resolvePath(targetFileRaw, currentPath);
                const file = fileSystem[targetFilePath];
                if (file && file.type === 'file') {
                    output = <pre>{file.content}</pre>;
                } else {
                    output = <pre>{`cat: ${targetFileRaw}: No such file or directory`}</pre>;
                }
                break;
            }
            case 'clear': setHistory([]); return;
            case '': output = ''; break;
            default: output = <pre>{`command not found: ${cmd}`}</pre>;
        }

        setHistory(prev => [...prev, { command: commandStr, output }]);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeCommand(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const commands = ['help', 'ls', 'cd', 'cat', 'clear', 'sudo'];
            const currentDirFiles = fileSystem[currentPath]?.children || [];
            const allCompletions = [...commands, ...currentDirFiles];

            const words = input.split(' ');
            const currentWord = words[words.length - 1];

            if (currentWord === '') return;

            const matches = allCompletions.filter(item => item.startsWith(currentWord));

            if (matches.length === 1) {
                const completedWord = matches[0];
                words[words.length - 1] = completedWord;
                setInput(words.join(' ') + ' ');
            } else if (matches.length > 1) {
                setHistory(prev => [...prev, { command: input, output: <pre className="flex flex-wrap gap-x-4">{matches.join('   ')}</pre> }]);
            }
        }
    };

    useEffect(() => {
        endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    return (
        <Card className="animate-glitch-in h-full flex flex-col" onMouseEnter={() => setInspectedItem({ title: 'Terminal', details: 'Direct access to the system shell. Standard commands are available.' })}>
            <CardHeader>
                <CardTitle></CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-2" onClick={() => inputRef.current?.focus()}>
                {history.map((entry, index) => (
                    <div key={index}>
                        <div className="flex items-center">
                            <span className="text-primary mr-2">{currentPath.replace('~', 'C:\\Users\\J.Williams')}>></span>
                            <span className="text-foreground">{entry.command}</span>
                        </div>
                        {entry.output && <div className="text-muted-foreground whitespace-pre-wrap mt-1 mb-3">{entry.output}</div>}
                    </div>
                ))}
                <div ref={endOfHistoryRef} />
            </CardContent>
            <CardFooter className="p-2 border-t border-primary/20">
                <form onSubmit={handleFormSubmit} className="flex w-full items-center">
                    <span className="text-primary mr-2">{currentPath.replace('~', 'C:\\Users\\J.Williams')}>></span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent text-foreground outline-none"
                        autoFocus
                    />
                </form>
            </CardFooter>
        </Card>
    );
};

const InspectorPanel = ({ item, openGallery }) => (
    <aside className="hidden lg:block w-80 flex-shrink-0">
        <Card className="sticky top-20 animate-glitch-in">
            <CardHeader className="flex flex-row items-start gap-4">
                <ScanSearch className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                    <CardTitle>ANALYSIS</CardTitle>
                    <CardDescription>Item Details</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <h4 className="font-sans text-secondary mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground min-h-[6rem]">{item.details}</p>
                {item.images && item.images.length > 0 && (
                    <div className="mt-4">
                        <h5 className="font-sans text-sm font-semibold text-primary mb-2">Attached Media</h5>
                        <div className="grid grid-cols-3 gap-2">
                            {item.images.map((img, index) => (
                                <button key={index} onClick={() => openGallery(item.images, index)} className="aspect-square border-2 border-transparent hover:border-primary transition-colors">
                                    <img src={img} alt={`${item.title} media ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </aside>
)

const FeaturedProjectsPanel = ({ projects, setView, setActiveProject }) => (
    <aside className="hidden lg:block w-80 flex-shrink-0">
        <Card className="sticky top-20 animate-glitch-in">
            <CardHeader>
                <CardTitle>Featured Projects</CardTitle>
                <CardDescription>Highlighted Case Files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {projects.map(project => (
                     <div
                        key={project.id}
                        className="w-full text-left p-2 rounded-md hover:bg-primary/10 border-t border-border first:border-t-0 cursor-pointer"
                        onClick={() => { setView('Projects'); setActiveProject(project.id); }}
                    >
                        <h4 className="font-sans font-semibold text-secondary">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 truncate">{project.description.split('\n')[0]}</p>
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center text-primary text-xs pt-1 hover:underline"
                            >
                                <Github className="mr-1 h-3 w-3" />
                                <span>View Source</span>
                            </a>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    </aside>
);

const NavItem = ({ view, icon: Icon, children, currentView, setView, setSheetOpen }) => (
    <Button
      variant={currentView === view ? "secondary" : "ghost"}
      onClick={() => {
        setView(view);
        if (setSheetOpen) setSheetOpen(false);
      }}
      className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10"
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{children}</span>
    </Button>
);

const AppSidebar = ({ view, setView, setSheetOpen, isAuthenticated }) => (
    <nav className="flex flex-col gap-1 p-2">
        <NavItem view="Dashboard" icon={Home} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>Dashboard</NavItem>
        <NavItem view="About" icon={FileUser} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>About</NavItem>
        <NavItem view="Education" icon={GraduationCap} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>Education</NavItem>
        <NavItem view="Certifications" icon={Award} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>Certifications</NavItem>
        <NavItem view="Experience" icon={Archive} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>Experience</NavItem>
        <NavItem view="Skills" icon={ScanSearch} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>Skills</NavItem>
        <NavItem view="Projects" icon={FileCode} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>Projects</NavItem>
        <NavItem view="Hobbies" icon={Coffee} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>Hobbies</NavItem>
        <NavItem view="Terminal" icon={Terminal} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>Terminal</NavItem>
        {isAuthenticated && <NavItem view="edit" icon={Edit} currentView={view} setView={setView} setSheetOpen={setSheetOpen}>EDIT MODE</NavItem>}
    </nav>
);

const DashboardHome = ({ data, setInspectedItem }) => {
    const keySkills = data?.skills?.filter(s => s.is_key_skill) || [];
    const latestExperience = data?.experience?.[0];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
                <Card className="animate-glitch-in" onMouseEnter={() => setInspectedItem({ title: 'User Profile', details: 'Main interface for user data. All modules are live.' })}>
                    <CardHeader>
                        <CardTitle>{data?.content?.name}</CardTitle>
                        <CardDescription>{data?.content?.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-mono text-lg">{data?.content?.dashboard_intro_text}</p>
                        <div className="flex gap-2 mt-4">
                             <Button asChild variant="secondary">
                                <a href="https://github.com/javo2002" target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-2 h-4 w-4" /> GitHub
                                </a>
                            </Button>
                             <Button asChild variant="secondary">
                                <a href="https://linkedin.com/in/jayxwilliams" target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
                {data?.content?.youtube_video_id && (
                    <Card className="animate-glitch-in" style={{animationDelay: '200ms'}}>
                        <CardHeader>
                            <CardTitle>YouTube</CardTitle>
                            <CardDescription>Featured Content</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${data.content.youtube_video_id}?autoplay=1&mute=1&loop=1&playlist=${data.content.youtube_video_id}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-8">
                <Card className="animate-glitch-in" style={{animationDelay: '100ms'}}>
                    <CardHeader>
                        <CardTitle>Professional Journey</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {latestExperience && (
                            <div>
                                <h4 className="font-sans text-sm font-semibold text-primary">Current Role</h4>
                                <p className="text-sm text-muted-foreground">{latestExperience.role}</p>
                            </div>
                        )}
                        <div>
                            <h4 className="font-sans text-sm font-semibold text-primary">Key Skills</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {keySkills.map(skill => <Badge key={skill.id} variant="outline">{skill.name}</Badge>)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const ImageGalleryModal = ({ isOpen, onClose, images, startIndex }) => {
    if (!isOpen) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] bg-card/80 backdrop-blur-lg border-primary/50 flex flex-col items-center justify-center">
                <Carousel className="w-full h-full" opts={{ startIndex: startIndex }}>
                    <CarouselContent className="h-full">
                        {images.map((img, index) => (
                            <CarouselItem key={index} className="flex items-center justify-center">
                                <img src={img} alt={`Gallery image ${index + 1}`} className="max-w-full max-h-full object-contain"/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </DialogContent>
        </Dialog>
    )
}

const SignInModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
        } else {
            onLoginSuccess();
            onClose();
        }
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Secure Access</DialogTitle>
                    <DialogDescription>Enter credentials to access editor mode.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Authenticate"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const EditPage = ({ data, refreshData }) => {
    if (!data) {
        return <p>Loading data...</p>
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Content Management System</CardTitle>
                <CardDescription>Select a tab to edit the corresponding portfolio data directly.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto flex-wrap">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="certifications">Certs</TabsTrigger>
                        <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="mt-4">
                        <ProfileForm initialData={data.content} refreshData={refreshData} />
                    </TabsContent>
                    <TabsContent value="experience" className="mt-4">
                        <ExperienceForm initialData={data.experience} refreshData={refreshData} />
                    </TabsContent>
                    <TabsContent value="projects" className="mt-4">
                        <ProjectsForm initialData={data.projects} refreshData={refreshData} />
                    </TabsContent>
                     <TabsContent value="skills" className="mt-4">
                        <SkillsForm initialData={data.skills} refreshData={refreshData} />
                    </TabsContent>
                     <TabsContent value="certifications" className="mt-4">
                        <CertificationsForm initialData={data.certifications} refreshData={refreshData} />
                    </TabsContent>
                    <TabsContent value="hobbies" className="mt-4">
                         <HobbiesForm initialData={data.content} refreshData={refreshData} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}


// --- Main App Component ---
const App = () => {
    const [view, setView] = useState("Dashboard");
    const [activeProject, setActiveProject] = useState(null);
    const [inspectedItem, setInspectedItem] = useState({ title: 'ANALYSIS', details: 'Awaiting input. Hover over a data module to begin analysis.' });
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [portfolioData, setPortfolioData] = useState({ content: null, experience: [], certifications: [], skills: [], projects: [] });

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryStartIndex, setGalleryStartIndex] = useState(0);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const longPressTimer = useRef();

    const handleSecretTriggerStart = () => {
        longPressTimer.current = setTimeout(() => {
            setShowLoginModal(true);
        }, 3000); // 3-second long press
    };

    const handleSecretTriggerEnd = () => {
        clearTimeout(longPressTimer.current);
    };


    const openGallery = (images, startIndex = 0) => {
        setGalleryImages(images);
        setGalleryStartIndex(startIndex);
        setIsGalleryOpen(true);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: contentData, error: contentError } = await supabase.from('portfolio_content').select('*').single();
            if (contentError) throw new Error(`Failed to fetch content: ${contentError.message}`);

            const { data: experienceData, error: experienceError } = await supabase.from('experience').select('*').order('id', { ascending: false });
            if (experienceError) throw new Error(`Failed to fetch experience: ${experienceError.message}`);

            const { data: certificationsData, error: certificationsError } = await supabase.from('certifications').select('*');
            if (certificationsError) throw new Error(`Failed to fetch certifications: ${certificationsError.message}`);

            const { data: skillsData, error: skillsError } = await supabase.from('skills').select('*');
            if (skillsError) throw new Error(`Failed to fetch skills: ${skillsError.message}`);

            const { data: projectsData, error: projectsError } = await supabase.from('projects').select('*').order('id');
            if (projectsError) throw new Error(`Failed to fetch projects: ${projectsError.message}`);

            setPortfolioData({
                content: contentData,
                experience: experienceData,
                certifications: certificationsData,
                skills: skillsData,
                projects: projectsData,
            });

        } catch (err) {
            console.error("Detailed error fetching portfolio data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Sign out failed: " + error.message);
        } else {
            toast.success("You have been signed out.");
            setView("Dashboard"); // Return to the main dashboard view
        }
    };

    useEffect(() => {

        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })

        fetchData();
        return () => subscription.unsubscribe()
    }, []);

    const featuredProjects = portfolioData.projects?.filter(p => p.is_featured) || [];

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <div className="flex min-h-screen w-full font-mono bg-background">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex w-64 flex-col border-r border-primary/20">
                    <div
                        className="flex h-32 items-center justify-center border-b border-primary/20 p-4"
                        onMouseDown={handleSecretTriggerStart}
                        onMouseUp={handleSecretTriggerEnd}
                        onTouchStart={handleSecretTriggerStart}
                        onTouchEnd={handleSecretTriggerEnd}
                        style={{ cursor: 'pointer' }}
                    >
                         <div className="relative w-24 h-24 glow-border">
                            <img
                                src={portfolioData.content?.profile_picture_url || 'https://placehold.co/100x100/0E0F11/FAFAFA?text=ID'}
                                alt="User Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>
                    <AppSidebar view={view} setView={setView} isAuthenticated={!!session} />
                    {portfolioData.content?.resume_url && (
                        <div className="p-2 mt-auto border-t border-primary/20">
                            <Button asChild variant="secondary" className="w-full">
                                <a href={portfolioData.content.resume_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4"/>
                                    Download Resume
                                </a>
                            </Button>
                        </div>
                    )}
                </aside>

                <div className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-primary/20 bg-background/95 px-4 backdrop-blur-sm sm:px-6">
                        {/* Mobile Navigation */}
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="outline" className="lg:hidden">
                                    <PanelLeft className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col bg-card pt-10">
                                <AppSidebar view={view} setView={setView} setSheetOpen={setSheetOpen} isAuthenticated={!!session} />
                                {portfolioData.content?.resume_url && (
                                     <div className="p-2 mt-auto border-t border-primary/20">
                                        <Button asChild variant="secondary" className="w-full">
                                            <a href={portfolioData.content.resume_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4"/>
                                                Download Resume
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>

                        <div
                            className="flex items-center gap-3 lg:hidden"
                            onMouseDown={handleSecretTriggerStart}
                            onMouseUp={handleSecretTriggerEnd}
                        >
                            <div className="relative w-10 h-10 glow-border">
                                <img
                                    src={portfolioData.content?.profile_picture_url || 'https://placehold.co/100x100/0E0F11/FAFAFA?text=ID'}
                                    alt="User Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <span className="text-sm font-semibold">{portfolioData.content?.name}</span>
                        </div>


                        <div className="ml-auto flex items-center gap-2">
                           {session && (
                                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                                    <LogOut className="h-5 w-5" />
                                    <span className="sr-only">Sign Out</span>
                                </Button>
                            )}
                        </div>
                    </header>
                    <main className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-6">
                        <div className="flex-grow" key={view}>
                            {(() => {
                                if (loading) {
                                    return (
                                        <div className="flex justify-center items-center h-full w-full">
                                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                                        </div>
                                    );
                                }

                                if (error) {
                                    return (
                                        <Card className="border-destructive bg-destructive/20">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-destructive">
                                                    <AlertTriangle /> CONNECTION FAILED
                                                </CardTitle>
                                                <CardDescription>Could not establish secure link to data server.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="font-mono bg-black/50 p-4 text-destructive-foreground">{error}</p>
                                            </CardContent>
                                        </Card>
                                    );
                                }

                                switch (view) {
                                    case "About": return <About data={portfolioData.content} setInspectedItem={setInspectedItem} />;
                                    case "Education": return <Education data={portfolioData.content} setInspectedItem={setInspectedItem} />;
                                    case "Experience": return <Experience data={portfolioData.experience} setInspectedItem={setInspectedItem} />;
                                    case "Certifications": return <Certifications data={portfolioData.certifications} credlyUrl={portfolioData.content?.credly_url} setInspectedItem={setInspectedItem} />;
                                    case "Skills": return <MaterialsSpecification skills={portfolioData.skills} setInspectedItem={setInspectedItem} />;
                                    case "Projects": return <ProjectBlueprints projects={portfolioData.projects} setInspectedItem={setInspectedItem} activeProject={activeProject} setActiveProject={setActiveProject} />;
                                    case "Hobbies": return <Hobbies data={portfolioData.content} setInspectedItem={setInspectedItem} />;
                                    case "Terminal": return <TerminalPage portfolioData={portfolioData} setInspectedItem={setInspectedItem} />;
                                    case "edit": return session ? <EditPage data={portfolioData} refreshData={fetchData} /> : <DashboardHome data={portfolioData} setInspectedItem={setInspectedItem} />;
                                    default: return <DashboardHome data={portfolioData} setInspectedItem={setInspectedItem} />;
                                }
                            })()}
                        </div>
                        {view === 'Dashboard' && featuredProjects.length > 0 && <FeaturedProjectsPanel projects={featuredProjects} setView={setView} setActiveProject={setActiveProject} />}
                        {view !== 'Dashboard' && <InspectorPanel item={inspectedItem} openGallery={openGallery} />}
                    </main>
                </div>
            </div>
            <ImageGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} images={galleryImages} startIndex={galleryStartIndex} />
            <SignInModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={() => {
                supabase.auth.getSession().then(({ data: { session } }) => {
                  setSession(session)
                })
            }} />
        </ThemeProvider>
    )
}

export default App
