import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, MapPin, Palette, Trash2, Edit2, Save, X, Clock, Sparkles, Heart, Image, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechyMemoLogo } from "@/components/MemoableLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCharacterLibrary } from "@/hooks/useCharacterLibrary";
import { useEnvironmentLibrary, EnhancedEnvironment } from "@/hooks/useEnvironmentLibrary";
import { useSceneStyleLibrary, SceneStyle, StyleType } from "@/hooks/useSceneStyleLibrary";
import { useBrandLibrary, Brand } from "@/hooks/useBrandLibrary";
import { useFavoritePhotos, FavoritePhoto } from "@/hooks/useFavoritePhotos";
import { EnhancedCharacter } from "@/types/prompt-builder";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Library() {
  const { savedCharacters, saveCharacter, removeCharacter } = useCharacterLibrary();
  const { savedEnvironments, saveEnvironment, removeEnvironment } = useEnvironmentLibrary();
  const { savedStyles: videoStyles, saveStyle: saveVideoStyle, removeStyle: removeVideoStyle } = useSceneStyleLibrary("video");
  const { savedStyles: imageStyles, saveStyle: saveImageStyle, removeStyle: removeImageStyle } = useSceneStyleLibrary("image");
  const { savedStyles: infographicStyles, saveStyle: saveInfographicStyle, removeStyle: removeInfographicStyle } = useSceneStyleLibrary("infographic");
  const { brands, saveBrand, updateBrand, removeBrand } = useBrandLibrary();
  const { photos, removePhoto, updatePhotoName, maxPhotos } = useFavoritePhotos();

  const [styleTab, setStyleTab] = useState<StyleType>("video");

  // Get current style data based on selected tab
  const getCurrentStyles = () => {
    switch (styleTab) {
      case "image": return imageStyles;
      case "infographic": return infographicStyles;
      default: return videoStyles;
    }
  };
  
  const savedStyles = getCurrentStyles();
  const allStylesCount = videoStyles.length + imageStyles.length + infographicStyles.length;

  const saveStyle = (style: Omit<SceneStyle, "id" | "createdAt">) => {
    switch (styleTab) {
      case "image": return saveImageStyle(style);
      case "infographic": return saveInfographicStyle(style);
      default: return saveVideoStyle(style);
    }
  };

  const removeStyle = (id: string) => {
    switch (styleTab) {
      case "image": return removeImageStyle(id);
      case "infographic": return removeInfographicStyle(id);
      default: return removeVideoStyle(id);
    }
  };

  const [editingCharacter, setEditingCharacter] = useState<EnhancedCharacter | null>(null);
  const [editingEnvironment, setEditingEnvironment] = useState<EnhancedEnvironment | null>(null);
  const [editingStyle, setEditingStyle] = useState<SceneStyle | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<FavoritePhoto | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSaveCharacter = () => {
    if (editingCharacter) {
      saveCharacter(editingCharacter);
      setEditingCharacter(null);
      toast.success("Character updated!");
    }
  };

  const handleSaveEnvironment = () => {
    if (editingEnvironment) {
      saveEnvironment(editingEnvironment);
      setEditingEnvironment(null);
      toast.success("Environment updated!");
    }
  };

  const handleSaveStyle = () => {
    if (editingStyle) {
      saveStyle({
        name: editingStyle.name,
        description: editingStyle.description,
        template: editingStyle.template,
      });
      setEditingStyle(null);
      toast.success("Scene style updated!");
    }
  };

  const handleSaveBrand = () => {
    if (editingBrand) {
      updateBrand(editingBrand.id, {
        name: editingBrand.name,
        description: editingBrand.description,
        colors: editingBrand.colors,
        fonts: editingBrand.fonts,
      });
      setEditingBrand(null);
      toast.success("Brand updated!");
    }
  };

  const handleDeleteCharacter = (id: number | string, name: string) => {
    if (confirm(`Delete "${name}" from your library?`)) {
      removeCharacter(id);
      toast.success("Character deleted");
    }
  };

  const handleDeleteEnvironment = (id: number | string, name: string) => {
    if (confirm(`Delete "${name}" from your library?`)) {
      removeEnvironment(id);
      toast.success("Environment deleted");
    }
  };

  const handleDeleteStyle = (id: string, name: string) => {
    if (confirm(`Delete "${name}" from your library?`)) {
      removeStyle(id);
      toast.success("Scene style deleted");
    }
  };

  const handleDeleteBrand = (id: string, name: string) => {
    if (confirm(`Delete "${name}" from your library?`)) {
      removeBrand(id);
      toast.success("Brand deleted");
    }
  };

  const handleSavePhoto = () => {
    if (editingPhoto) {
      updatePhotoName(editingPhoto.id, editingPhoto.name);
      setEditingPhoto(null);
      toast.success("Photo updated!");
    }
  };

  const handleDeletePhoto = (id: string, name: string) => {
    if (confirm(`Delete "${name}" from your favorites?`)) {
      removePhoto(id);
      toast.success("Photo deleted");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <TechyMemoLogo size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <h1 className="text-lg font-semibold text-foreground">Library</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="characters" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5">
            <TabsTrigger value="characters" className="gap-1.5">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Characters</span>
              {savedCharacters.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {savedCharacters.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="environments" className="gap-1.5">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Environments</span>
              {savedEnvironments.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {savedEnvironments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="styles" className="gap-1.5">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Styles</span>
              {allStylesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {allStylesCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="brands" className="gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Brands</span>
              {brands.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {brands.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-1.5">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Photos</span>
              {photos.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-rose-100 text-rose-600 text-xs rounded-full">
                  {photos.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Characters Tab */}
          <TabsContent value="characters" className="space-y-4">
            {savedCharacters.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No characters saved"
                description="Characters you create in the Video builder will appear here"
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {savedCharacters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    isEditing={editingCharacter?.id === char.id}
                    editingData={editingCharacter?.id === char.id ? editingCharacter : null}
                    onEdit={() => setEditingCharacter({ ...char })}
                    onCancel={() => setEditingCharacter(null)}
                    onSave={handleSaveCharacter}
                    onDelete={() => handleDeleteCharacter(char.id, char.name)}
                    onChange={(field, value) =>
                      setEditingCharacter((prev) => prev ? { ...prev, [field]: value } : null)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Environments Tab */}
          <TabsContent value="environments" className="space-y-4">
            {savedEnvironments.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No environments saved"
                description="Environments you create in the Video builder will appear here"
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {savedEnvironments.map((env) => (
                  <EnvironmentCard
                    key={env.id}
                    environment={env}
                    isEditing={editingEnvironment?.id === env.id}
                    editingData={editingEnvironment?.id === env.id ? editingEnvironment : null}
                    onEdit={() => setEditingEnvironment({ ...env })}
                    onCancel={() => setEditingEnvironment(null)}
                    onSave={handleSaveEnvironment}
                    onDelete={() => handleDeleteEnvironment(env.id, env.name)}
                    onChange={(field, value) =>
                      setEditingEnvironment((prev) => prev ? { ...prev, [field]: value } : null)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Scene Styles Tab */}
          <TabsContent value="styles" className="space-y-4">
            {/* Style Type Tabs */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={styleTab === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setStyleTab("video")}
                className="gap-1.5"
              >
                <Video className="w-4 h-4" />
                Video ({videoStyles.length})
              </Button>
              <Button
                variant={styleTab === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => setStyleTab("image")}
                className="gap-1.5"
              >
                <Image className="w-4 h-4" />
                Image ({imageStyles.length})
              </Button>
              <Button
                variant={styleTab === "infographic" ? "default" : "outline"}
                size="sm"
                onClick={() => setStyleTab("infographic")}
                className="gap-1.5"
              >
                <FileText className="w-4 h-4" />
                Infographic ({infographicStyles.length})
              </Button>
            </div>

            {savedStyles.length === 0 ? (
              <EmptyState
                icon={Palette}
                title={`No ${styleTab} styles saved`}
                description={`Custom ${styleTab} styles you save will appear here`}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {savedStyles.map((style) => (
                  <StyleCard
                    key={style.id}
                    style={style}
                    isEditing={editingStyle?.id === style.id}
                    editingData={editingStyle?.id === style.id ? editingStyle : null}
                    onEdit={() => setEditingStyle({ ...style })}
                    onCancel={() => setEditingStyle(null)}
                    onSave={handleSaveStyle}
                    onDelete={() => handleDeleteStyle(style.id, style.name)}
                    onChange={(field, value) =>
                      setEditingStyle((prev) => prev ? { ...prev, [field]: value } : null)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brands" className="space-y-4">
            {brands.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No brands saved"
                description="Create brand kits in the Image or Infographic builder to save them here"
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {brands.map((brand) => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    isEditing={editingBrand?.id === brand.id}
                    editingData={editingBrand?.id === brand.id ? editingBrand : null}
                    onEdit={() => setEditingBrand({ ...brand })}
                    onCancel={() => setEditingBrand(null)}
                    onSave={handleSaveBrand}
                    onDelete={() => handleDeleteBrand(brand.id, brand.name)}
                    onChange={(field, value) =>
                      setEditingBrand((prev) => prev ? { ...prev, [field]: value } : null)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-4">
            {photos.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No favorite photos saved"
                description="Upload photos in the Image builder and save them to your favorites"
              />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {photos.length} of {maxPhotos} favorite photos
                </p>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {photos.map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      isEditing={editingPhoto?.id === photo.id}
                      editingData={editingPhoto?.id === photo.id ? editingPhoto : null}
                      onEdit={() => setEditingPhoto({ ...photo })}
                      onCancel={() => setEditingPhoto(null)}
                      onSave={handleSavePhoto}
                      onDelete={() => handleDeletePhoto(photo.id, photo.name)}
                      onChange={(name) =>
                        setEditingPhoto((prev) => prev ? { ...prev, name } : null)
                      }
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Empty State Component
function EmptyState({ icon: Icon, title, description }: { icon: typeof Users; title: string; description: string }) {
  return (
    <Card className="p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Link to="/" className="inline-block mt-4">
        <Button variant="outline" size="sm">
          Go to Builder
        </Button>
      </Link>
    </Card>
  );
}

// Character Card Component
function CharacterCard({
  character,
  isEditing,
  editingData,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onChange,
  formatDate,
}: {
  character: EnhancedCharacter;
  isEditing: boolean;
  editingData: EnhancedCharacter | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onChange: (field: string, value: string) => void;
  formatDate: (t: number) => string;
}) {
  const data = isEditing && editingData ? editingData : character;

  return (
    <Card className={cn("overflow-hidden transition-all", isEditing && "ring-2 ring-primary")}>
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-emerald-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold">
            {data.name.charAt(0).toUpperCase()}
          </div>
          {isEditing ? (
            <input
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="font-semibold bg-white border border-border rounded px-2 py-1 text-foreground"
            />
          ) : (
            <h3 className="font-semibold text-foreground">{data.name}</h3>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onSave} className="text-emerald-600">
                <Save className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onDelete} className="text-rose-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Field
          label="Look"
          value={data.enhancedLook || data.look}
          isEditing={isEditing}
          onChange={(v) => onChange("enhancedLook", v)}
        />
        <Field
          label="Demeanor"
          value={data.enhancedDemeanor || data.demeanor}
          isEditing={isEditing}
          onChange={(v) => onChange("enhancedDemeanor", v)}
        />
        <Field
          label="Role"
          value={data.enhancedRole || data.role}
          isEditing={isEditing}
          onChange={(v) => onChange("enhancedRole", v)}
        />
        <div className="pt-2 border-t border-border/50 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Added {formatDate(character.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}

// Environment Card Component
function EnvironmentCard({
  environment,
  isEditing,
  editingData,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onChange,
  formatDate,
}: {
  environment: EnhancedEnvironment;
  isEditing: boolean;
  editingData: EnhancedEnvironment | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onChange: (field: string, value: string) => void;
  formatDate: (t: number) => string;
}) {
  const data = isEditing && editingData ? editingData : environment;

  return (
    <Card className={cn("overflow-hidden transition-all", isEditing && "ring-2 ring-primary")}>
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-orange-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
            <MapPin className="w-5 h-5" />
          </div>
          {isEditing ? (
            <input
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="font-semibold bg-white border border-border rounded px-2 py-1 text-foreground"
            />
          ) : (
            <h3 className="font-semibold text-foreground">{data.name}</h3>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onSave} className="text-emerald-600">
                <Save className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onDelete} className="text-rose-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Field
          label="Setting"
          value={data.enhancedSetting || data.setting}
          isEditing={isEditing}
          onChange={(v) => onChange("enhancedSetting", v)}
        />
        <Field
          label="Lighting"
          value={data.enhancedLighting || data.lighting}
          isEditing={isEditing}
          onChange={(v) => onChange("enhancedLighting", v)}
        />
        <Field
          label="Audio"
          value={data.enhancedAudio || data.audio}
          isEditing={isEditing}
          onChange={(v) => onChange("enhancedAudio", v)}
        />
        <Field
          label="Props"
          value={data.enhancedProps || data.props}
          isEditing={isEditing}
          onChange={(v) => onChange("enhancedProps", v)}
        />
        <div className="pt-2 border-t border-border/50 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Added {formatDate(environment.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}

// Scene Style Card Component
function StyleCard({
  style,
  isEditing,
  editingData,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onChange,
  formatDate,
}: {
  style: SceneStyle;
  isEditing: boolean;
  editingData: SceneStyle | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onChange: (field: string, value: string) => void;
  formatDate: (t: number) => string;
}) {
  const data = isEditing && editingData ? editingData : style;

  return (
    <Card className={cn("overflow-hidden transition-all", isEditing && "ring-2 ring-primary")}>
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
            <Palette className="w-5 h-5" />
          </div>
          {isEditing ? (
            <input
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="font-semibold bg-white border border-border rounded px-2 py-1 text-foreground"
            />
          ) : (
            <h3 className="font-semibold text-foreground">{data.name}</h3>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onSave} className="text-emerald-600">
                <Save className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onDelete} className="text-rose-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Field
          label="Description"
          value={data.description}
          isEditing={isEditing}
          onChange={(v) => onChange("description", v)}
        />
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Template</label>
          {isEditing ? (
            <textarea
              value={data.template}
              onChange={(e) => onChange("template", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-slate-50 border border-border rounded-lg text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          ) : (
            <p className="text-sm text-foreground bg-slate-50 p-3 rounded-lg max-h-24 overflow-y-auto">
              {data.template}
            </p>
          )}
        </div>
        <div className="pt-2 border-t border-border/50 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Added {formatDate(style.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}

// Brand Card Component
function BrandCard({
  brand,
  isEditing,
  editingData,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onChange,
  formatDate,
}: {
  brand: Brand;
  isEditing: boolean;
  editingData: Brand | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onChange: (field: string, value: string | string[]) => void;
  formatDate: (t: number) => string;
}) {
  const data = isEditing && editingData ? editingData : brand;

  return (
    <Card className={cn("overflow-hidden transition-all", isEditing && "ring-2 ring-primary")}>
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          {isEditing ? (
            <input
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="font-semibold bg-card border border-border rounded px-2 py-1 text-foreground"
            />
          ) : (
            <h3 className="font-semibold text-foreground">{data.name}</h3>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onSave} className="text-emerald-600">
                <Save className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onDelete} className="text-rose-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Field
          label="Description"
          value={data.description}
          isEditing={isEditing}
          onChange={(v) => onChange("description", v)}
        />
        {(data.colors?.length || isEditing) && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Colors</label>
            {isEditing ? (
              <input
                value={data.colors?.join(", ") || ""}
                onChange={(e) => onChange("colors", e.target.value.split(",").map(c => c.trim()))}
                placeholder="Comma-separated colors"
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.colors?.map((color, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-1 rounded text-xs font-mono bg-muted"
                    style={{ 
                      backgroundColor: color.startsWith('#') ? `${color}20` : undefined,
                      borderLeft: color.startsWith('#') ? `3px solid ${color}` : undefined
                    }}
                  >
                    {color}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {(data.fonts || isEditing) && (
          <Field
            label="Typography"
            value={data.fonts || ""}
            isEditing={isEditing}
            onChange={(v) => onChange("fonts", v)}
          />
        )}
        <div className="pt-2 border-t border-border/50 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Added {formatDate(brand.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}

// Photo Card Component
function PhotoCard({
  photo,
  isEditing,
  editingData,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onChange,
  formatDate,
}: {
  photo: FavoritePhoto;
  isEditing: boolean;
  editingData: FavoritePhoto | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onChange: (name: string) => void;
  formatDate: (t: number) => string;
}) {
  const data = isEditing && editingData ? editingData : photo;

  return (
    <Card className={cn("overflow-hidden transition-all", isEditing && "ring-2 ring-rose-500")}>
      <div className="aspect-square relative">
        <img
          src={photo.imageBase64}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {isEditing ? (
            <input
              value={data.name}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-border rounded text-sm text-foreground"
              autoFocus
            />
          ) : (
            <h3 className="font-medium text-white truncate">{data.name}</h3>
          )}
        </div>
      </div>
      <div className="p-3 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDate(photo.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onSave} className="text-emerald-600">
                <Save className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon-sm" onClick={onEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onDelete} className="text-rose-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

// Reusable Field Component
function Field({
  label,
  value,
  isEditing,
  onChange,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-slate-50 border border-border rounded-lg text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <p className="text-sm text-foreground">{value || <span className="text-muted-foreground italic">Not set</span>}</p>
      )}
    </div>
  );
}
