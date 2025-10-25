import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Plus, FileText } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { mockPapers, mockCollections } from "@/lib/mock-data";

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Collections</h1>
          <p className="text-muted-foreground mt-1">
            Organize, annotate, and share your research.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      <Tabs defaultValue={mockCollections[0].id} className="space-y-4">
        <TabsList>
          {mockCollections.map((collection) => (
            <TabsTrigger key={collection.id} value={collection.id}>
              {collection.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {mockCollections.map((collection) => (
          <TabsContent key={collection.id} value={collection.id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline">{collection.name}</CardTitle>
                  <CardDescription className="mt-1">{collection.description}</CardDescription>
                </div>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mockPapers
                    .slice(0, collection.paperCount)
                    .map((paper) => (
                      <PaperCard key={paper.id} paper={paper} />
                    ))}
                    <Card className="flex flex-col items-center justify-center border-dashed">
                       <div className="text-center p-6">
                         <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                         <p className="mt-4 text-sm font-medium">Add papers to this collection</p>
                         <p className="mt-1 text-xs text-muted-foreground">Find papers using the search page.</p>
                         <Button variant="outline" size="sm" className="mt-4">
                            Go to Search
                         </Button>
                       </div>
                    </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
